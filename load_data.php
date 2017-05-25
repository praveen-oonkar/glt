<?php

//Tracking execution time
$start = microtime(true);

//create database variables
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "geo_tagging";

try {

    $conn = new PDO("mysql:host=$servername", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $conn->query("use $dbname");


 	//creating a table to store geo-coordinates derived from ip
    $sql = "CREATE TABLE IF NOT EXISTS data (id int(50) auto_increment, ip_address varchar(255) NOT NULL,
    			data_accessed_time TIMESTAMP NOT NULL, latitude varchar(50), longitude varchar(50),
    			PRIMARY key(id))";
    $conn->exec($sql);

    //creating a table to store ip addresses with no geo-coordinates
    $sql = "CREATE TABLE IF NOT EXISTS data_no_geolocation (id int(50) auto_increment, 
    			ip_address varchar(255) NOT NULL, data_accessed_time TIMESTAMP NOT NULL, 
    			PRIMARY key(id))";
    $conn->exec($sql);


    //creating temperory variables to store data
    $row = true;
    $count = 0;

	//reading data from file using read only restriction.
	if (($handle = fopen("data/data.csv", "r")) !== FALSE)
	{
    	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) 
    	{    	
    		if(!$row)
    		{
	    			$stmt = $conn->prepare("INSERT INTO data (`ip_address`,`data_accessed_time`,`latitude`,`longitude`) VALUES (:par2, :par3, :par4, :par5)");
				    $stmt->bindParam(':par2', $data[1]);
				    $stmt->bindParam(':par3', $data[2]);
				    $stmt->bindParam(':par4', $data[3]);
				    $stmt->bindParam(':par5', $data[4]);
				    $stmt->execute();
	    		 	$count++;
	    	}
	    	else
			    $row = false;		    		   	
			    
    	}
	}

	fclose($handle); //closing file
	$row1 = true;

	//reading data from file using read only restriction.
	if (($handle = fopen("data/data_no_geolocation.csv", "r")) !== FALSE)
	{
    	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) 
    	{    	
    		if(!$row1)
    		{
	    			$stmt = $conn->prepare("INSERT INTO data_no_geolocation(`ip_address`,`data_accessed_time`) VALUES (:par2, :par3)");
				    $stmt->bindParam(':par2', $data[1]);
				    $stmt->bindParam(':par3', $data[2]);
				    $stmt->execute();
	    		 	$count++;
	    	}
	    	else
			    $row1 = false;		    		   	
			    
    	}
	}

    fclose($handle); //closing file

    //printing the execution time and count of ipaddresses with geo-coordinates
    //echo "Number of rows:".$count;
	echo "true";
	}
    
    catch(PDOException $e) //expection handling
    {
      echo "false";      
    }

$time_elapsed_secs = microtime(true) - $start;
//echo "<br>".$time_elapsed_secs;

$conn = null;

?>