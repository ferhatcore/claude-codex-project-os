# Catalog testing

From this repository: focused/full suite `node --test catalog.test.mjs`; smoke `node catalog.mjs`. Both use `data.json` local fictional fixtures. No environment variables or services are needed. Before QA record actual stdout/stderr/exit codes and the suite outcome. New filter behavior needs success, invalid/missing/duplicate argument and regression checks. No test may be disabled to hide a failure.
