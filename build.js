const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");

async function ls() {
  const { stdout, stderr } = await exec(
    "cd ./Frontend && pnpm install && pnpm run build"
  );
  console.log("stdout:", stdout);
  console.log("stderr:", stderr);
  // const stderr = "";
  if (stderr.trim() == "" && fs.existsSync("./Frontend/dist")) {
    try {
      await require("fs-extra").copy("./Frontend/dist", "./Backend/dist");
      console.log("success");
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  } else {
    process.exit(1);
  }

  {
    process.exit(0);
  }
}
ls();
