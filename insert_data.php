<?php

date_default_timezone_set('US/Eastern');
//create database variables
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "geo_tagging";
try {

    $conn = new PDO("mysql:host=$servername", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //Creating Database for doesnt exist
    $dbname = "`".str_replace("`","``",$dbname)."`";
    $conn->query("CREATE DATABASE IF NOT EXISTS $dbname");
    $conn->query("use $dbname");


	//creating a table to store geo-coordinates derived from ip
    $sql = "CREATE TABLE IF NOT EXISTS data (id int(50) auto_increment, ip_address varchar(255) 
    	    NOT NULL, data_accessed_time TIMESTAMP NOT NULL, latitude varchar(50), 
    	    longitude varchar(50), PRIMARY key(id))";
    $conn->exec($sql);

    //creating a table to store ip addresses with no geo-coordinates
    $sql = "CREATE TABLE IF NOT EXISTS data_no_geolocation (id int(50) auto_increment, 
    			ip_address varchar(255) NOT NULL, data_accessed_time TIMESTAMP NOT NULL, 
    			PRIMARY key(id))";
    $conn->exec($sql);

    $query = json_decode(file_get_contents('https://api.ipify.org/?format=json'));
	$ip = $query->ip;	
	//echo $ip;
	//echo date('Y-m-d H:i:s');

	$stmt = $conn->prepare("INSERT INTO data (ip_address,data_accessed_time,latitude,longitude) VALUES (:par1, :par2, :par3, :par4)");
    $stmt->bindParam(':par1', $ip);
    $stmt->bindParam(':par2', date('Y-m-d H:i:s'));
	$stmt->bindParam(':par3', $_GET['latitude']);
	$stmt->bindParam(':par4', $_GET['longitude']);
	$stmt->execute();
	echo "true";    			    		   	
			    
    }    
    catch(PDOException $e) //expection handling
    {
      echo "false";
      echo "connection Error!</br>";
      echo $e;
    }

$conn = null;

?>