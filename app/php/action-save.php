<?php
   //создаем имя: 
   $name = time().'.png';
  //записываем, перекодируя в base64
  file_put_contents($name, base64_decode($_POST['data'] ));
  //возвращаем имя созданного файла 
  echo( $name );
?>