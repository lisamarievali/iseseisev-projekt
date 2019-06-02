<?php

// Kontrollime, et saadetakse nimi ja skoor, ning et nimi ei oleks tühi
if (isset($_POST['name']) && isset($_POST['score']) && !empty($_POST['name'])) {

    // Kontrollime, et skooride fail on olemas ja laeme sisse olemasolevad skoorid
    $scores = file_exists('scores.json') ? json_decode(file_get_contents('scores.json'), true) : null;

    // Kui skoore ei ole, siis teeme uue massiivi
    if (empty($scores)) {
        $scores = [];
    }

    // Lisame uue skoori massiivi
    $scores[] = ['name' => $_POST['name'], 'score' => (int)$_POST['score']];

    // Salvestame skoorid uuesti faili
    file_put_contents('scores.json', json_encode($scores));
}


