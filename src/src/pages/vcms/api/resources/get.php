<?php

use vcms\FileSystem;
use vcms\resources\VResource;

$resourceLocation = PROJECT_LOCATION . '/' . VResource::REPO_DIRPATH . '/' . $location;
if (!file_exists($resourceLocation)) {
    $Feedback->failure('the resource doesn\'t exist');
}

$resources = FileSystem::get_directories($resourceLocation);

$informations = [
    'children'=> $resources
];

$Feedback->success('pages fetched.', $informations);