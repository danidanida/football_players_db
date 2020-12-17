module.exports = {
    addPlayerPage: (req, res) => {
        res.render('add-player.ejs',
            {
                message: '',
                title: 'Soccer Players | Add Player'
            })
    },

    addPlayer: (req, res) => {

        //*************************************
        // If the file was not uploaded
        //*************************************
        if (!req.files) {
            return res.status(400).send('No files were uploaded');
        }
        //*************************************
        // Putting the values from the form into the variables
        //*************************************
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;

        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;

        //*************************************
        // Checking if such a player exists
        //*************************************
        let query = `select * from players where first_name = '${first_name}' and last_name = '${last_name}'`;

        db.query(query, (err, resultSet) => {
            let message = '';
            if (err) {
                return res.status(500).send(err);
            }

            if (resultSet.length > 0) {

                message = "This player already exists";
                res.render('add-player.ejs',
                    {
                        message: message,
                        title: 'Soccer Players | Add Player'
                    })
            } else {

                //*************************************
                // Checking file type
                //*************************************

                if (uploadedFile.mimetype.split('/')[0] !== 'image') {
                    message = "The file to upload is not an image";
                    res.render('add-player.ejs',
                        {
                            message: message,
                            title: 'Soccer Players | Add Player'
                        })
                } else {

                    uploadedFile.mv(`public/images/${image_name}`, (err) => {
                        if (err) {
                            return res.status(500).send(err)
                        }

                        //*************************************
                        // INSERT !!!!!!!!!!
                        //*************************************
                        query = `INSERT INTO players (first_name, last_name, position, number, image, user_name)   VALUES ('${first_name}','${last_name}','${position}', ${number}, '${image_name}', '${username}')`;

                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send('The insert has failed');
                            }
                            res.redirect('/');
                        }) // THE INSERT

                    }) // Uploading file
                } // File type is OK - continue

            } // The player does not exist - continue

        }) // db query for the existing player




    }, // AddPlayer

    editPlayerPage: (req, res) => {
        let message = "";
        let query = `select * from players where id=${req.params.id}`;

        db.query(query, (err, resultSet) => {
            if (err) { return res.status(500).send(err) }

            res.render('edit-player.ejs', {
                message,  // message: message, (if property the same)
                title: 'Soccer Players | Edit Player',
                player: resultSet[0]
            })
        })
        //console.log(req.params.id)


    },
    editPlayer: (req, res) => {
        //console.log(req.params.id)
        // console.log(req.body.first_name)
        let id = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let number = req.body.number;
        let position = req.body.position;

        let query = `update players set first_name = '${first_name}', last_name = '${last_name}', number = '${number}', position = '${position}' where id = '${id}'`;

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.redirect('/')
        })

    },
    deletePlayer: (req, res) => {
        //console.log(req.params.id)
        // console.log(req.body.first_name)
        let id = req.params.id;

        let query = `delete from players where id = '${id}'`;

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.redirect('/')
        })
    }
}
