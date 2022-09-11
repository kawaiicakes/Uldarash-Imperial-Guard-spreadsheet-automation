function communicate() {
    try {
      var mySQL = Jdbc.getConnection("");
       const stmt = mySQL.prepareStatement('INSERT INTO TestTable ' +
        '(col1, col2) values (?, ?)');
        stmt.setString(1, 'This is bullshit');
        stmt.setString(2, 'Yeah real');
        stmt.execute();
    } catch (err) {
      Logger.log('Failed with an error %s', err.message);
    }
  } //HOLY SHIT IT WORKS