const getHomepage = ((req, res) => {
    // query - request data from DB 
    let query = "select * from players order by first_name asc";

    db.query(query, (err, resultSet) => {
        if (err) {
            console.log('Problem to bring players from db: ' + err)
            res.redirect('/')
        }
        else {

            res.render('index.ejs', {
                title: 'Socker Players',
                players: resultSet
            });
        }
    });
});




module.exports = getHomepage;



