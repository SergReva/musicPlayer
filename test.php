<?php

    $files = file_get_contents("track.json");
    $fileList = [];
    $domain = "http://chevida.at.ua/music/";
    $id = 4;
    $idT = 0;
    $nIndex = 0;

    function translit($str) {
        $rus = array('А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я', 'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я', '&');
        
        $lat = array('A', 'B', 'V', 'G', 'D', 'E', 'E', 'Gh', 'Z', 'I', 'Y', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'C', 'Ch', 'Sh', 'Sch', 'Y', 'Y', 'Y', 'E', 'Yu', 'Ya', 'a', 'b', 'v', 'g', 'd', 'e', 'e', 'gh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'sch', '', '', '', 'e', 'yu', 'ya', 'and');
        
        return str_replace($rus, $lat, $str);
  }

    foreach (glob("audio/*.mp3") as $filename) {
        $strArray = ["(", ")","—", "kissvk.com-", "(zvukoff.ru)", "(zf.fm)", ","];
        $title = basename($filename, ".mp3");
        $songWidth = mb_strimwidth(str_ireplace($strArray, "-", str_ireplace(" ", "_", $filename)), 0, 50, ".mp3");

        copy($filename, "audio/back/" . basename($filename));
        rename($filename, translit(trim($songWidth), "-"));

        $id++;
        $val = array(
            'id' => $id,
            'class' => 'theDeli',
            'url' => $domain . translit($songWidth),
            'author' => 'MUSIC',
            'title' => str_ireplace("_", " ", $title),
        );

        array_push($fileList, $val);    
    }
    shuffle($fileList);

    $json = json_encode($fileList, JSON_UNESCAPED_UNICODE);
    echo $json ;
    file_put_contents("track.json", $json);

?>