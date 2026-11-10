# Catalog conventions

Evidence: `catalog.mjs` and `catalog.test.mjs` use ES modules and Node standard libraries. CLI success is exit 0; invalid arguments are exit 2 with usage on stderr and no stdout. Preserve fixture order and input immutability. Do not add a framework or dependency for the small proposed filter. There is no monetary, authentication, localisation or database behavior in this example.
