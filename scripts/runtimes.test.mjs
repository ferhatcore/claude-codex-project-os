import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { initialize } from './init.mjs';
import { validate } from './check.mjs';
import { configErrors, distributionRoot } from './lib.mjs';
import { codexRoles, codexSkills, claudeRoles, claudeSkills } from './runtimes.mjs';

const sandbox=mkdtempSync(path.join(tmpdir(),'project-os-runtime-test-'));
const target=name=>path.join(sandbox,name);
const read=file=>readFileSync(file,'utf8');
const load=file=>JSON.parse(read(file));
after(()=>{
  assert.equal(path.dirname(sandbox),path.resolve(tmpdir()));
  assert.ok(path.basename(sandbox).startsWith('project-os-runtime-test-'));
  rmSync(sandbox,{recursive:true,force:true});
});

test('old install calls still produce only Claude entries with unchanged task scope',()=>{
  const {target:root,runtime}=initialize({target:target('default'),example:true});
  assert.equal(runtime,'claude');
  assert.ok(existsSync(path.join(root,'CLAUDE.md')));
  assert.ok(!existsSync(path.join(root,'AGENTS.md')));
  assert.ok(!existsSync(path.join(root,'.codex')));
  assert.ok(!existsSync(path.join(root,'.agents')));
  assert.equal(read(path.join(root,'planning/tasks/TB-001.md')),read(path.join(distributionRoot,'examples/trailboard/planning/tasks/TB-001.md')));
  assert.deepEqual(validate(root,{workspace:true}).errors,[]);
});

test('Claude installs the team as project subagents and skills; reviewer stays read-only',()=>{
  const {target:root}=initialize({target:target('claude-team'),runtime:'claude',example:true});
  for(const role of claudeRoles){
    const text=read(path.join(root,`.claude/agents/${role}.md`));
    assert.ok(text.startsWith(`---\nname: project-os-${role}\n`));
    assert.match(text,/^description: .+$/m);
  }
  assert.match(read(path.join(root,'.claude/agents/reviewer.md')),/^tools: Read, Grep, Glob$/m);
  assert.doesNotMatch(read(path.join(root,'.claude/agents/qa.md')),/^tools:.*\bAgent\b/m);
  for(const skill of claudeSkills)assert.ok(read(path.join(root,`.claude/skills/${skill}/SKILL.md`)).startsWith(`---\nname: ${skill}\n`));
  const guide=read(path.join(root,'CLAUDE.md'));
  assert.match(guide,/## Claude Code team/);
  assert.match(guide,/project-os-developer/);
  assert.ok(!existsSync(path.join(root,'.claude/settings.json')));
  assert.deepEqual(validate(root,{workspace:true}).errors,[]);
});

test('both mode keeps Claude-only team text out of AGENTS.md and Codex files out of CLAUDE.md',()=>{
  const {target:root}=initialize({target:target('both-team'),runtime:'both'});
  assert.ok(existsSync(path.join(root,'.claude/agents/developer.md')));
  assert.ok(existsSync(path.join(root,'.codex/agents/developer.toml')));
  assert.doesNotMatch(read(path.join(root,'AGENTS.md')),/Claude Code team/);
  assert.doesNotMatch(read(path.join(root,'CLAUDE.md')),/Codex delegation/);
  assert.deepEqual(validate(root,{workspace:true}).errors,[]);
});

test('broken Claude subagent metadata or a writable reviewer is reported; legacy workspaces stay valid',()=>{
  const {target:root}=initialize({target:target('broken-claude'),runtime:'claude'});
  const reviewer=path.join(root,'.claude/agents/reviewer.md');
  writeFileSync(reviewer,read(reviewer).replace('tools: Read, Grep, Glob','tools: Read, Grep, Glob, Edit, Write'));
  rmSync(path.join(root,'.claude/skills/project-os-qa'),{recursive:true});
  const errors=validate(root,{workspace:true}).errors;
  assert.ok(errors.some(e=>e.includes('reviewer must stay read-only')));
  assert.ok(errors.some(e=>e.includes('project-os-qa/SKILL.md')));
  rmSync(path.join(root,'.claude/agents'),{recursive:true});
  rmSync(path.join(root,'.claude/skills'),{recursive:true});
  assert.deepEqual(validate(root,{workspace:true}).errors,[]);
});

test('each workspace ships its own validator, which catches records written in the wrong shape',()=>{
  const env={...process.env};delete env.NODE_TEST_CONTEXT;
  for(const runtime of ['claude','codex','both']){
    const {target:root}=initialize({target:target(`self-check-${runtime}`),runtime,name:'Notes'});
    assert.ok(existsSync(path.join(root,'planning/formats.md')));
    const run=()=>spawnSync(process.execPath,['.project-os/check.mjs','--workspace','.'],{cwd:root,env,encoding:'utf8'});
    const clean=run();
    assert.equal(clean.status,0,clean.stderr);
    const file=path.join(root,'.project-os.json');
    const config=load(file);
    // The shape a PM produced in a real session before planning/formats.md existed.
    config.repositories=[{id:'notes',path:'repos/notes',type:'Node.js CLI',owner:'pending',git_flow:'main',push_triggered_deployment:'none'}];
    writeFileSync(file,JSON.stringify(config,null,2)+'\n');
    const broken=run();
    assert.equal(broken.status,1);
    assert.match(broken.stderr,/unknown field git_flow/);
    assert.match(broken.stderr,/unsupported type/);
  }
});

test('Codex only installs native entries, all role definitions and skills without Claude entry files',()=>{
  const {target:root}=initialize({target:target('codex'),runtime:'codex',example:true});
  assert.equal(load(path.join(root,'.project-os.json')).runtime,'codex');
  for(const entry of ['AGENTS.md','repos/catalog/AGENTS.md','repos/handbook/AGENTS.md'])assert.ok(existsSync(path.join(root,entry)));
  for(const entry of ['CLAUDE.md','repos/catalog/CLAUDE.md','repos/handbook/CLAUDE.md'])assert.ok(!existsSync(path.join(root,entry)));
  for(const role of codexRoles){
    const text=read(path.join(root,`.codex/agents/${role}.toml`));
    assert.match(text,new RegExp(`name = "project_os_${role}"`));
    assert.ok(!/^(model|sandbox_mode|approval_policy|model_provider)\s*=/m.test(text));
  }
  for(const skill of codexSkills)assert.ok(existsSync(path.join(root,`.agents/skills/${skill}/SKILL.md`)));
  assert.ok(!read(path.join(root,'repos/catalog/AGENTS.md')).includes('CLAUDE.md'));
  assert.deepEqual(validate(root,{workspace:true}).errors,[]);
});

test('both clients share one task file, board, decisions and fixture code',()=>{
  const {target:root}=initialize({target:target('both'),runtime:'both',example:true});
  for(const entry of ['CLAUDE.md','AGENTS.md','repos/catalog/CLAUDE.md','repos/catalog/AGENTS.md'])assert.ok(existsSync(path.join(root,entry)));
  assert.deepEqual(readdirSync(path.join(root,'planning/tasks')).sort(),['_template.md','TB-001.md'].sort());
  for(const file of ['planning/tasks/TB-001.md','planning/board.md','repos/catalog/catalog.mjs','repos/catalog/data.json'])assert.equal(read(path.join(root,file)),read(path.join(distributionRoot,'examples/trailboard',file)));
  assert.ok(!existsSync(path.join(root,'.codex/planning')));
  assert.ok(!existsSync(path.join(root,'.agents/planning')));
  assert.deepEqual(validate(root,{workspace:true}).errors,[]);
});

test('all nine runtime/profile choices install with coherent native worker caps',()=>{
  for(const runtime of ['claude','codex','both'])for(const [profile,cap] of [['lean',1],['standard',2],['heavy',3]]){
    const {target:root}=initialize({target:target(`${runtime}-${profile}`),runtime,profile,example:true});
    assert.equal(load(path.join(root,'.project-os.json')).budget.max_active_workers,cap);
    if(runtime!=='claude')assert.match(read(path.join(root,'.codex/config.toml')),new RegExp(`^max_concurrent_threads_per_session = ${cap}$`,'m'));
    assert.deepEqual(validate(root,{workspace:true}).errors,[]);
  }
});

test('a generic Codex workspace has valid links without inventing repositories or approvals',()=>{
  const {target:root}=initialize({target:target('generic-codex'),runtime:'codex',name:'Example'});
  assert.deepEqual(load(path.join(root,'.project-os.json')).repositories,[]);
  assert.match(read(path.join(root,'planning/decisions.md')),/No human product/);
  assert.ok(!existsSync(path.join(root,'.git')));
  assert.ok(!existsSync(path.join(root,'.claude/settings.json')));
  assert.deepEqual(validate(root,{workspace:true}).errors,[]);
});

test('invalid runtime is refused before destination creation',()=>{
  for(const runtime of ['other','CODEX','',null]){
    const destination=target(`invalid-${String(runtime)||'empty'}`);
    assert.throws(()=>initialize({target:destination,runtime}),/Runtime/);
    assert.ok(!existsSync(destination));
  }
});

test('existing runtime controls cannot be overwritten by choosing another client',()=>{
  const {target:root}=initialize({target:target('preserved'),runtime:'both'});
  const before=read(path.join(root,'.codex/config.toml'));
  assert.throws(()=>initialize({target:root,runtime:'claude'}),/exists/);
  assert.equal(read(path.join(root,'.codex/config.toml')),before);
});

test('schema v1 without a runtime field remains compatible',()=>{
  const {target:root}=initialize({target:target('legacy')});
  const file=path.join(root,'.project-os.json');
  const config=load(file);delete config.runtime;
  writeFileSync(file,JSON.stringify(config,null,2)+'\n');
  assert.deepEqual(configErrors(config,root,true),[]);
  assert.deepEqual(validate(root,{workspace:true}).errors,[]);
  config.runtime='unsupported';
  assert.ok(configErrors(config,root).some(e=>e.includes('runtime must be')));
});

test('missing Codex entry and native agent fields cause validation failure',()=>{
  const {target:root}=initialize({target:target('broken-roles'),runtime:'codex',example:true});
  rmSync(path.join(root,'repos/catalog/AGENTS.md'));
  const file=path.join(root,'.codex/agents/qa.toml');
  writeFileSync(file,read(file).replace('developer_instructions','incorrect_field'));
  const errors=validate(root,{workspace:true}).errors;
  assert.ok(errors.some(e=>e.includes('AGENTS.md entry rules missing')));
  assert.ok(errors.some(e=>e.includes('required agent fields missing')));
});

test('wrong skill metadata, cap drift and ineffective permission overrides are reported',()=>{
  const {target:root}=initialize({target:target('broken-metadata'),runtime:'codex'});
  const skill=path.join(root,'.agents/skills/project-os-start/SKILL.md');
  writeFileSync(skill,read(skill).replace('name: project-os-start','name: other'));
  writeFileSync(path.join(root,'.codex/config.toml'),'[agents]\nmax_concurrent_threads_per_session = 9\n');
  const role=path.join(root,'.codex/agents/reviewer.toml');
  writeFileSync(role,read(role)+'\napproval_policy = "never"\n');
  const errors=validate(root,{workspace:true}).errors;
  assert.ok(errors.some(e=>e.includes('skill metadata')));
  assert.ok(errors.some(e=>e.includes('worker cap differs')));
  assert.ok(errors.some(e=>e.includes('unsupported per-agent permission')));
});

test('CLI accepts runtime selection and rejects unknown values without creating a target',()=>{
  const env={...process.env};delete env.NODE_TEST_CONTEXT;
  const script=path.join(distributionRoot,'scripts/init.mjs');
  const root=target('cli-codex');
  const installed=spawnSync(process.execPath,[script,'--target',root,'--runtime','codex','--example'],{env,encoding:'utf8'});
  assert.equal(installed.status,0,installed.stderr);
  assert.ok(existsSync(path.join(root,'AGENTS.md')));
  const refused=spawnSync(process.execPath,[script,'--target',target('cli-invalid'),'--runtime','other'],{env,encoding:'utf8'});
  assert.equal(refused.status,1);
  assert.ok(!existsSync(target('cli-invalid')));
});
