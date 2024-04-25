import { chunk, flatten } from "lodash";

export type LazyTask<T> = () => T | Promise<T>; // sync or async function
export type LazyPipelineTask<T> = (data: T) => T | Promise<T>; // sync or async function

// Run a set of independent tasks in parallel
export async function runInParallel<T>(tasks: LazyTask<T>[], batchSize: number): Promise<T[]> {
  // split functionList array into batches of batchSize, using lodash
  const batches = chunk(tasks, batchSize);

  // create a task to run a single batch
  const singleBatchTask = (batch: LazyTask<T>[]) => () => Promise.all((batch.map((fn) => fn())));

  // chain batch tasks
  const batchTasks = batches.map(singleBatchTask);
  return runInSequence(batchTasks)
    .then(flatten); // flatten arrays to form a single array
}
type SeqReducer<T> = (prevProm: Promise<T[]>, nextTask: LazyTask<T>) => Promise<T[]>;
const seqReducer = <T>(prevProm: Promise<T[]>, nextTask: LazyTask<T>) =>
  prevProm.then((previousResults: T[]) =>
    Promise.resolve(nextTask()).then((nextResult: T) =>
      previousResults.concat(nextResult)
    )
  );

// Run a list of INDEPEPENDENT tasks in sequence
export function runInSequence<T>(tasks: LazyTask<T>[]): Promise<T[]> {
  return tasks.reduce(seqReducer as SeqReducer<T>, Promise.resolve([]));
}

const runNextPipelineTask = <T>(nextTask: LazyPipelineTask<T>, previousResult: T) => nextTask(previousResult);
const pipelineReducer = <T>(prevProm: Promise<T>, nextTask: LazyPipelineTask<T>) =>
  prevProm.then((previousResult: T) =>
    runNextPipelineTask(nextTask, previousResult));


type PipelineReducer<T> = (prevProm: Promise<T>, nextTask: LazyPipelineTask<T>) => Promise<T>;
// Run tasks as a pipeline, i.e. output of one task is input to the next
export function runAsPipeline<T>(steps: LazyPipelineTask<T>[]) {
  return (init: T | Promise<T>): Promise<T> => steps.reduce(
    pipelineReducer as PipelineReducer<T>,
    Promise.resolve(init));
}

/*
function Example() {
  const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

  {
    // sync
    const task1: LazyTask<number> = () => (1);
    const task2: LazyTask<number> = () => sleep(1000).then(() => (2));
    const task3: LazyTask<number> = () => Promise.resolve(3);
    const task4: LazyTask<number> = () => Promise.resolve(4);
    const task5: LazyTask<number> = () => Promise.resolve(5);
    const task6: LazyTask<number> = () => Promise.resolve(6);
    const task7: LazyTask<number> = () => Promise.resolve(7);
    const task8: LazyTask<number> = () => Promise.resolve(8);
    const task9: LazyTask<number> = () => Promise.resolve(9);
    const task10: LazyTask<number> = () => Promise.resolve(10);

    const tasks = [task1, task2, task3, task4, task5, task6, task7, task8, task9, task10];
    const batchSize = 3;
    runInParallel(tasks, batchSize).then(console.log);

    runInSequence(tasks).then(console.log);
  }


  // Pipeline
  {
    // sync
    const task1: LazyPipelineTask<number> = (i: number) => (i + 1);
    // async
    const task2: LazyPipelineTask<number> = async (i: number) => (i + 2);
    const task3: LazyPipelineTask<number> = (i: number) => sleep(2000).then(() => (i * 41));
    const task4: LazyPipelineTask<number> = (i: number) => Promise.resolve(i + 2);

    const pipelineTasks = [task1, task2, task3, task4,];
    runAsPipeline(pipelineTasks)(0).then(console.log);
  }
}

Example()
*/