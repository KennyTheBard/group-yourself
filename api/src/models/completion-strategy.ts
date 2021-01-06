
export enum CompletionStrategy {
   // self explanatory
   Random = "RANDOM", 

   // find the current average score of each group according to its memebers
   // and add new memebers with the target of changing that average score as little
   // as possible
   KeepAvgScore = "KEEP_AVERAGE_SCORE",

   // keep an uniform average score across all groups
   UniformScore = "UNIFORM_SCORE",

   // lower scores with lower scores, higher scores with higher scores
   SortedScore = "SORTED_SCORE",
 }