#!/usr/bin/env node

require("esbuild")
  .serve(
    {
      host: "localhost",
      servedir: "www",
    },
    {
      entryPoints: ["src/index.js"],
      outfile: "www/js/bundle.js",
      bundle: true,
      sourcemap: true,
      target: ["chrome58", "firefox57"],
      logLevel: "info",
    }
  )
  .then((server) => {
    console.log(`Running on: ${server.host}:${server.port}`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
