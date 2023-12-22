import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("preferences.db");

// export const setUpDatabase = () => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, content TEXT NOT NULL)",
//       [],
//       () => console.log("Preferences table created successfully"),
//       (_, error) => console.error("Error creating preferences table", error)
//     );

//     tx.executeSql(
//       "SELECT COUNT(*) FROM notes WHERE type IN (?, ?, ?)",
//       ["actors", "genres", "flagged"],
//       (_, result) => {
//         const count = result.rows.item(0)["COUNT(*)"];
//         if (count === 0) {
//           tx.executeSql(
//             "INSERT INTO notes (type, content) VALUES (?, ?), (?, ?), (?, ?)",
//             ["actors", ""],
//             ["genres", ""],
//             ["flagged", ""],
//             (_, result) => {
//               console.log("Rows inserted successfully");
//               const insertedIds = [];
//               for (let i = 0; i < result.rows.length; i++) {
//                 insertedIds.push(result.rows.item(i).id);
//               }
//               console.log(
//                 "Rows inserted successfully. Inserted IDs:",
//                 insertedIds
//               );
//             },
//             (_, error) => console.error("Error inserting rows", error)
//           );
//         }
//       },
//       (_, error) => console.error("Error checking rows", error)
//     );
//   });
// };

export const setUpDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS actor (id INTEGER PRIMARY KEY AUTOINCREMENT, actorId INTEGER NOT NULL, profileImageUrl TEXT, name TEXT NOT NULL)",
      [],
      () => console.log("actor table created successfully"),
      (_, error) => console.error("Error creating actors table", error)
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS favMovieGenre (id INTEGER PRIMARY KEY AUTOINCREMENT, favMovieGenreId INTEGER NOT NULL)",
      [],
      () => console.log("favMovieGenre table created successfully"),
      (_, error) => console.error("Error creating favMovieGenre table", error)
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS favTvGenre (id INTEGER PRIMARY KEY AUTOINCREMENT, favTvGenreId INTEGER NOT NULL)",
      [],
      () => console.log("favTvGenre table created successfully"),
      (_, error) => console.error("Error creating favTvGenre table", error)
    );

    // tx.executeSql(
    //   "CREATE TABLE IF NOT EXISTS flaggedMovie (id INTEGER PRIMARY KEY AUTOINCREMENT, flaggedMovieId INTEGER NOT NULL)",
    //   [],
    //   () => console.log("flaggedMovie table created successfully"),
    //   (_, error) => console.error("Error creating flaggedMovies table", error)
    // );

    // tx.executeSql(
    //   "CREATE TABLE IF NOT EXISTS flaggedTv (id INTEGER PRIMARY KEY AUTOINCREMENT, flaggedTvId INTEGER NOT NULL)",
    //   [],
    //   () => console.log("flaggedTv table created successfully"),
    //   (_, error) => console.error("Error creating flaggedTv table", error)
    // );
  });
};

// export const da = (id, type, content) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "UPDATE preferences SET type = ?, content = ? WHERE id = ?",
//         [type, content, id],
//         (_, result) => resolve("row affectesd: ", result.rowsAffected),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

export const deleteActor = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM actor WHERE actorId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertActor = (actorId, profileImageUrl, name) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO actor (actorId, profileImageUrl, name) VALUES ( ?,?,?)",
        [actorId, profileImageUrl, name],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchActor = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM actor ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const actor = rows._array;
          // Resolve the Promise with the settings data
          resolve(actor);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching actors:", error);
        }
      );
    });
  });
};

export const deleteFavMovieGenre = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM favMovieGenre WHERE favMovieGenreId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertFavMovieGenre = (genreId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO favMovieGenre (favMovieGenreId) VALUES ( ?)",
        [genreId],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchFavMovieGenre = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM favMovieGenre ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const favMovieGenre = rows._array;
          // Resolve the Promise with the settings data
          resolve(favMovieGenre);
          //console.log("favMovieGenre list:", favMovieGenre);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching favMovieGenre:", error);
        }
      );
    });
  });
};

export const deleteFavTvGenre = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM favTvGenre WHERE favTvGenreId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertFavTvGenre = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO favTvGenre (favTvGenreId) VALUES ( ?)",
        [id],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchFavTvGenre = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM favTvGenre ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const favTvGenre = rows._array;
          // Resolve the Promise with the settings data
          resolve(favTvGenre);
          //console.log("favTvGenre list:", favMovieGenre);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching favTvGenre:", error);
        }
      );
    });
  });
};

// export const deleteFlaggedMovie = (id) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "DELETE FROM flaggedMovie WHERE flaggedMovieId = ?",
//         [id],
//         (_, result) => resolve(result.rowsAffected),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// // export const insertFlaggedMovie = (id) => {
// //   return new Promise((resolve, reject) => {
// //     db.transaction((tx) => {
// //       tx.executeSql(
// //         "INSERT INTO favTvGenre (favTvGenreId) VALUES ( ?)",
// //         [id],
// //         (_, result) => resolve(result.insertId),
// //         (_, error) => reject(error)
// //       );
// //     });
// //   });
// // };

// export const insertFlaggedMovie = (id) => {
//   return new Promise(async (resolve, reject) => {
//     const db = SQLite.openDatabase("preferences.db");

//     db.transaction((tx) => {
//       // Check if the entry already exists
//       tx.executeSql(
//         "SELECT * FROM flaggedMovie WHERE flaggedMovieId = ?",
//         [id],
//         (_, { rows }) => {
//           const existingEntry = rows.length > 0;

//           if (existingEntry) {
//             // Entry already exists, cancel the transaction
//             console.log("Entry already exists. Transaction canceled.");
//             return;
//           }

//           // Entry doesn't exist, proceed with the insert
//           tx.executeSql(
//             "INSERT INTO flaggedMovie (flaggedMovieId) VALUES (?)",
//             [id],
//             (_, result) => resolve(result.insertId),
//             (_, error) => reject(error)
//           );
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// export const fetchFlaggedMovie = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM flaggedMovie",
//         [],
//         (_, { rows }) => {
//           // Retrieve the settings data
//           const flaggedMovie = rows._array;
//           // Resolve the Promise with the settings data
//           resolve(flaggedMovie);
//           //console.log("flaggedMovie list:", favMovieGenre);
//         },
//         (error) => {
//           // Reject the Promise with the error
//           reject(error);
//           console.log("Error fetching flaggedMovie:", error);
//         }
//       );
//     });
//   });
// };

// export const deleteFlaggedTv = (id) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "DELETE FROM flaggedTv WHERE flaggedTvId = ?",
//         [id],
//         (_, result) => resolve(result.rowsAffected),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// // export const insertFlaggedTv = (id) => {
// //   return new Promise((resolve, reject) => {
// //     db.transaction((tx) => {
// //       tx.executeSql(
// //         "INSERT INTO flaggedTv ( flaggedTvId) VALUES ( ?)",
// //         [id],
// //         (_, result) => resolve(result.insertId),
// //         (_, error) => reject(error)
// //       );
// //     });
// //   });
// // };

// export const insertFlaggedTv = (id) => {
//   return new Promise(async (resolve, reject) => {
//     const db = SQLite.openDatabase("preferences.db");

//     db.transaction((tx) => {
//       // Check if the entry already exists
//       tx.executeSql(
//         "SELECT * FROM flaggedTv WHERE flaggedTvId = ?",
//         [id],
//         (_, { rows }) => {
//           const existingEntry = rows.length > 0;

//           if (existingEntry) {
//             // Entry already exists, cancel the transaction
//             console.log("Entry already exists. Transaction canceled.");
//             return;
//           }

//           // Entry doesn't exist, proceed with the insert
//           tx.executeSql(
//             "INSERT INTO flaggedTv (flaggedTvId) VALUES (?)",
//             [id],
//             (_, result) => resolve(result.insertId),
//             (_, error) => reject(error)
//           );
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// export const fetchFlaggedTv = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM flaggedTv",
//         [],
//         (_, { rows }) => {
//           // Retrieve the settings data
//           const flaggedTv = rows._array;
//           // Resolve the Promise with the settings data
//           resolve(flaggedTv);
//           //console.log("flaggedMovie list:", favMovieGenre);
//         },
//         (error) => {
//           // Reject the Promise with the error
//           reject(error);
//           console.log("Error fetching flaggedTv:", error);
//         }
//       );
//     });
//   });
// };
