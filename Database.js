import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("preferences.db");

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

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS favTv (id INTEGER PRIMARY KEY AUTOINCREMENT, favTvId INTEGER NOT NULL, name TEXT NOT NULL, posterImageUrl TEXT, firstAirDate TEXT)",
      [],
      () => console.log("favTv table created successfully"),
      (_, error) => console.error("Error creating favTv table", error)
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS favMovie (id INTEGER PRIMARY KEY AUTOINCREMENT, favMovieId INTEGER NOT NULL, name TEXT NOT NULL,  posterImageUrl TEXT, releaseDate TEXT)",
      [],
      () => console.log("favMovie table created successfully"),
      (_, error) => console.error("Error creating favMoive table", error)
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS watchlistMovie (id INTEGER PRIMARY KEY AUTOINCREMENT, watchlistMovieId INTEGER NOT NULL, name TEXT NOT NULL,  posterImageUrl TEXT, releaseDate TEXT)",
      [],
      () => console.log("watchlistMovie table created successfully"),
      (_, error) => console.error("Error creating watchlistMovie table", error)
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS watchlistTv (id INTEGER PRIMARY KEY AUTOINCREMENT, watchlistTvId INTEGER NOT NULL, name TEXT NOT NULL, posterImageUrl TEXT, firstAirDate TEXT)",
      [],
      () => console.log("watchlistTv table created successfully"),
      (_, error) => console.error("Error creating watchlistTv table", error)
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS ratedTv (id INTEGER PRIMARY KEY AUTOINCREMENT, ratedTvId INTEGER NOT NULL, name TEXT NOT NULL, posterImageUrl TEXT, firstAirDate TEXT, ratedValue REAL NOT NULL)",
      [],
      () => console.log("ratedTv table created successfully"),
      (_, error) => console.error("Error creating ratedTv table", error)
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS ratedMovie (id INTEGER PRIMARY KEY AUTOINCREMENT, ratedMovieId INTEGER NOT NULL, name TEXT NOT NULL, posterImageUrl TEXT, releaseDate TEXT, ratedValue REAL NOT NULL)",
      [],
      () => console.log("ratedMovie table created successfully"),
      (_, error) => console.error("Error creating ratedMovie table", error)
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS reviewedMovie (id INTEGER PRIMARY KEY AUTOINCREMENT, reviewedMovieId INTEGER NOT NULL, userName TEXT NOT NULL, content TEXT NOT NULL)",
      [],
      () => console.log("reviewedMovie table created successfully"),
      (_, error) => console.error("Error creating reviewedMovie table", error)
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS reviewedTv (id INTEGER PRIMARY KEY AUTOINCREMENT, reviewedTvId INTEGER NOT NULL, userName TEXT NOT NULL, content TEXT NOT NULL)",
      [],
      () => console.log("reviewedTv table created successfully"),
      (_, error) => console.error("Error creating reviewedTv table", error)
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS movieReview (id INTEGER PRIMARY KEY AUTOINCREMENT, movieId INTEGER NOT NULL, content TEXT NOT NULL)",
      [],
      () => console.log("movieReviews table created successfully"),
      (_, error) => console.error("Error creating movieReviews table", error)
    );

    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS tvReview (id INTEGER PRIMARY KEY AUTOINCREMENT, tvID INTEGER NOT NULL, content TEXT NOT NULL)",
      [],
      () => console.log("tvReviews table created successfully"),
      (_, error) => console.error("Error creating tvReviews table", error)
    );
  });
};

export const updateTvReview = (id, newContent) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE tvReview SET content = ? WHERE tvId = ?`,
        [newContent, id],
        // (_, { rowsAffected }) => {
        //   if (rowsAffected > 0) {
        //     resolve(true); // Update successful
        //   } else {
        //     resolve(false); // No rows affected, update failed
        //   }
        // },
        (_, result) => resolve(result.rowsAffected),
        // (_, error) => {
        //   reject(error); // Error occurred while executing SQL
        // }
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteTvReview = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM tvReview WHERE tvID = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertTvReview = (id, content) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO tvReview (tvId, content) VALUES (?, ?)",
        [id, content],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchTvReview = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM tvReview WHERE tvId = ?",
        [id],
        (_, { rows }) => {
          // Retrieve the settings data
          const tvReview = rows._array;
          // Resolve the Promise with the settings data
          resolve(tvReview);
          // console.log("favMovieGenre list:", favMovieGenre);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching tvId:", error);
        }
      );
    });
  });
};

export const updateMovieReview = (id, newContent) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE movieReview SET content = ? WHERE movieId = ?`,
        [newContent, id],
        // (_, { rowsAffected }) => {
        //   if (rowsAffected > 0) {
        //     resolve(true); // Update successful
        //   } else {
        //     resolve(false); // No rows affected, update failed
        //   }
        // },
        (_, result) => resolve(result.rowsAffected),
        // (_, error) => {
        //   reject(error); // Error occurred while executing SQL
        // }
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteMovieReview = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM movieReview WHERE movieId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertMovieReview = (id, content) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO movieReview (movieId, content) VALUES (?, ?)",
        [id, content],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchMovieReview = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM movieReview WHERE movieId = ?",
        [id],
        (_, { rows }) => {
          // Retrieve the settings data
          const favMovieGenre = rows._array;
          // Resolve the Promise with the settings data
          resolve(favMovieGenre);
          // console.log("favMovieGenre list:", favMovieGenre);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching movieId:", error);
        }
      );
    });
  });
};
export const deleteRatedTv = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM ratedTv WHERE ratedTvId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

// export const insertRatedTv = (
//   tvId,
//   posterImageUrl,
//   name,
//   releaseDate,
//   value
// ) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO ratedTv (ratedTvId, posterImageUrl, name, firstAirDate, ratedValue) VALUES (?,?,?,?,?)",
//         [tvId, posterImageUrl, name, releaseDate, value],
//         (_, result) => resolve(result.insertId),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

export const insertRatedTv = (
  tvId,
  posterImageUrl,
  name,
  releaseDate,
  value
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Check if entry already exists
      tx.executeSql(
        "SELECT COUNT(*) FROM ratedTv WHERE ratedTvId = ?",
        [tvId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          if (count > 0) {
            // Entry already exists, cancel transaction
            console.error("Entry already exists in ratedTv");
            reject();
            return;
          }

          // Entry does not exist, execute insert statement
          tx.executeSql(
            "INSERT INTO ratedTv (ratedTvId, posterImageUrl, name, firstAirDate, ratedValue) VALUES (?,?,?,?,?)",
            [tvId, posterImageUrl, name, releaseDate, value],
            (_, result) => resolve(result.insertId),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};
export const fetchRatedTv = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM ratedTv ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const ratedTv = rows._array;
          // Resolve the Promise with the settings data
          resolve(ratedTv);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching ratedTv:", error);
        }
      );
    });
  });
};

export const deleteWatchlistTv = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM watchlistTv WHERE watchlistTvId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

// export const insertWatchlistTv = (tvId, posterImageUrl, name, firstAirDate) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO watchlistTv (watchlistTvId, posterImageUrl, name, firstAirDate) VALUES (?,?,?,?)",
//         [tvId, posterImageUrl, name, firstAirDate],
//         (_, result) => resolve(result.insertId),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

export const insertWatchlistTv = (tvId, posterImageUrl, name, firstAirDate) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Check if entry already exists
      tx.executeSql(
        "SELECT COUNT(*) FROM watchlistTv WHERE watchlistTvId = ?",
        [tvId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          if (count > 0) {
            // Entry already exists, cancel transaction
            console.error("Entry already exists in watchlistTv");
            reject();
            return;
          }

          // Entry does not exist, execute insert statement
          tx.executeSql(
            "INSERT INTO watchlistTv (watchlistTvId, posterImageUrl, name, firstAirDate) VALUES (?,?,?,?)",
            [tvId, posterImageUrl, name, firstAirDate],
            (_, result) => resolve(result.insertId),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchWatchlistTv = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM watchlistTv ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const watchlistTv = rows._array;
          // Resolve the Promise with the settings data
          resolve(watchlistTv);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching watchlistTv:", error);
        }
      );
    });
  });
};

export const deleteFavTv = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM favTv WHERE favTvId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

// export const insertFavTv = (tvId, posterImageUrl, name, firstAirDate) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO favTv (favTvId, posterImageUrl, name, firstAirDate) VALUES (?,?,?,?)",
//         [tvId, posterImageUrl, name, firstAirDate],
//         (_, result) => resolve(result.insertId),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

export const insertFavTv = (tvId, posterImageUrl, name, firstAirDate) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Check if entry already exists
      tx.executeSql(
        "SELECT COUNT(*) FROM favTv WHERE favTvId = ?",
        [tvId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          if (count > 0) {
            // Entry already exists, cancel transaction
            console.error("Entry already exists in favTv");
            reject();
            return;
          }

          // Entry does not exist, execute insert statement
          tx.executeSql(
            "INSERT INTO favTv (favTvId, posterImageUrl, name, firstAirDate) VALUES (?,?,?,?)",
            [tvId, posterImageUrl, name, firstAirDate],
            (_, result) => resolve(result.insertId),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchFavTv = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM favTv ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const favTv = rows._array;
          // Resolve the Promise with the settings data
          resolve(favTv);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching favTv:", error);
        }
      );
    });
  });
};

export const deleteRatedMovie = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM ratedMovie WHERE ratedMovieId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

// export const insertRatedMovie = (
//   movieId,
//   posterImageUrl,
//   name,
//   releaseDate,
//   value
// ) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO ratedMovie (ratedMovieId, posterImageUrl, name, releaseDate, ratedValue) VALUES (?,?,?,?,?)",
//         [movieId, posterImageUrl, name, releaseDate, value],
//         (_, result) => resolve(result.insertId),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };
export const insertRatedMovie = (
  movieId,
  posterImageUrl,
  name,
  releaseDate,
  value
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Check if entry already exists
      tx.executeSql(
        "SELECT COUNT(*) FROM ratedMovie WHERE ratedMovieId = ?",
        [movieId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          if (count > 0) {
            // Entry already exists, cancel transaction
            console.error("Entry already exists in ratedMovie");
            reject();
            return;
          }

          // Entry does not exist, execute insert statement
          tx.executeSql(
            "INSERT INTO ratedMovie (ratedMovieId, posterImageUrl, name, releaseDate, ratedValue) VALUES (?,?,?,?,?)",
            [movieId, posterImageUrl, name, releaseDate, value],
            (_, result) => resolve(result.insertId),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchRatedMovie = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM ratedMovie ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const ratedMovie = rows._array;
          // Resolve the Promise with the settings data
          resolve(ratedMovie);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching ratedMovie:", error);
        }
      );
    });
  });
};

export const deleteWatchListMovie = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM watchlistMovie WHERE watchlistMovieId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

// export const insertWatchlistMovie = (
//   movieId,
//   posterImageUrl,
//   name,
//   releaseDate
// ) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO watchlistMovie (watchlistMovieId, posterImageUrl, name, releaseDate) VALUES (?,?,?,?)",
//         [movieId, posterImageUrl, name, releaseDate],
//         (_, result) => resolve(result.insertId),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };
export const insertWatchlistMovie = (
  movieId,
  posterImageUrl,
  name,
  releaseDate
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Check if entry already exists
      tx.executeSql(
        "SELECT COUNT(*) FROM watchlistMovie WHERE watchlistMovieId = ?",
        [movieId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          if (count > 0) {
            // Entry already exists, cancel transaction
            console.error("Entry already exists in watchlistMovie");
            reject();
            return;
          }

          // Entry does not exist, execute insert statement
          tx.executeSql(
            "INSERT INTO watchlistMovie (watchlistMovieId, posterImageUrl, name, releaseDate) VALUES (?,?,?,?)",
            [movieId, posterImageUrl, name, releaseDate],
            (_, result) => resolve(result.insertId),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchWatchlistMovie = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM watchlistMovie ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const watchlistMovie = rows._array;
          // Resolve the Promise with the settings data
          resolve(watchlistMovie);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching watchlistMovie:", error);
        }
      );
    });
  });
};

export const deleteFavMovie = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM favMovie WHERE favMovieId = ?",
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error)
      );
    });
  });
};

// export const insertFavMovie = (movieId, posterImageUrl, name, releaseDate) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "INSERT INTO favMovie (favMovieId, posterImageUrl, name, releaseDate) VALUES (?,?,?,?)",
//         [movieId, posterImageUrl, name, releaseDate],
//         (_, result) => resolve(result.insertId),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };
export const insertFavMovie = (movieId, posterImageUrl, name, releaseDate) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Check if entry already exists
      tx.executeSql(
        "SELECT COUNT(*) FROM favMovie WHERE favMovieId = ?",
        [movieId],
        (_, result) => {
          const count = result.rows.item(0)["COUNT(*)"];
          if (count > 0) {
            // Entry already exists, cancel transaction
            console.error("Entry already exists in favMovie");
            reject();
            return;
          }

          // Entry does not exist, execute insert statement
          tx.executeSql(
            "INSERT INTO favMovie (favMovieId, posterImageUrl, name, releaseDate) VALUES (?,?,?,?)",
            [movieId, posterImageUrl, name, releaseDate],
            (_, result) => resolve(result.insertId),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchFavMovie = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM favMovie ",
        [],
        (_, { rows }) => {
          // Retrieve the settings data
          const favMovie = rows._array;
          // Resolve the Promise with the settings data
          resolve(favMovie);
          //console.log("Actors list:", actors);
        },
        (error) => {
          // Reject the Promise with the error
          reject(error);
          console.log("Error fetching favMovie:", error);
        }
      );
    });
  });
};

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
