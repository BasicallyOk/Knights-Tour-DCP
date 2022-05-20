async function main() {
    const compute = require('dcp/compute');
  
    
    /* WORK FUNCTION */
    async function workFn(letter) {
        progress();
        return letter.toUpperCase();
    }
    /* INPUT SET */
    const inputSet = Array.from('yelling!');
    
    /* COMPUTE FOR */
    const job = compute.for(inputSet, workFn);
    job.public.name = 'toUpperCompute';
  
    // SKIP IF: you do not need a compute group
    // job.computeGroups = [{ joinKey: 'KEY', joinSecret: 'SECRET' }];
    job.computeGroups = [{ joinKey: "aitf", joinSecret: "9YDEXdihud" }];

  
    // Not mandatory console logs for status updates
    job.on('accepted', () => {
      console.log(` - Job accepted with id: ${job.id}`);
    });
    job.on('result', (ev) => {
      console.log(` - Received result ${ev}`);
    });
    job.on("status", (ev) => {
        console.log("Got status update: ", ev);
    });
    job.on("complete", (ev) => {
        console.log("got complete");
    });
    job.on("readystatechange", (arg) => {
        console.log(`new ready state: ${arg}`);
    });
    job.on("error", (err) => {
        console.error(`Error: ${JSON.stringify(err)}`);
    });
  
    /* PROCESS RESULTS */
    let resultSet = await job.exec();
    resultSet = Array.from(resultSet);
    console.log(resultSet.toString().replace(',', ''));
    console.log(' - Job Complete');
  }
  require('dcp-client').init('https://scheduler.distributed.computer').then(main);