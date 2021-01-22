const { default: axios } = require('axios');


const pick = (arr) => {
   return arr[Math.floor(Math.random() * arr.length)];
}

const repeats = 500;

const collectionId = 1;
const groupIds = [1, 2, 3, 4, 5];

const studentNum = 50;
const studentIds = [...Array(studentNum).keys()].map(n => n + 1)

const uuidCode = '12345678901234567890123456789012';

(async () => {
   await Promise.all([...Array(repeats).keys()].map(() => {
      return new Promise((resolve, reject) => {
         axios.post('http://localhost:3000/api/stud/enroll', {
            groupId: pick(groupIds)
         }, {
            headers: {
               'Authorization-Student': `${pick(studentIds)}:${uuidCode}`
            }
         }).then(() => {
            resolve();
         }).catch(() => {
            resolve();
         })
      });
   }));

   await axios.get(`http://localhost:3000/api/stud/collection/data/${collectionId}`, {
      headers: {
         'Authorization-Student': `${pick(studentIds)}:${uuidCode}`
      }
   }).then(result => {
      const collection = result.data;
      collection.groups
         .map(g => {
            if (g.occupiedSeats !== g.students.length) {
               console.log('Group incorrect', g);
            }
         });

      const occupiedSeats = collection.groups.map(g => g.occupiedSeats).reduce((acc, curr) => acc + curr, 0);
      const unseatedStudents = collection.unseatedStudents.length;
      if (studentNum === occupiedSeats + unseatedStudents) {
         console.log('All right!');
      } else {
         console.log('Not all right.');
      }
   }).catch(err => {
      console.log(err);
   });
})();
