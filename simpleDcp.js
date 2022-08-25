async function main() {
    const compute = require('dcp/compute');
  
    /* INPUT SET */
    const inputSet = Array.from('yelling!');
  
    /* WORK FUNCTION */
    async function workFn(letter) {
      progress();
      return letter.toUpperCase();
    }
  
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
  
    /* PROCESS RESULTS */
    let resultSet = await job.exec();
    resultSet = Array.from(resultSet);
    console.log(resultSet.toString().replace(',', ''));
    console.log(' - Job Complete');
  }
  require('dcp-client').init('https://scheduler.distributed.computer').then(main);