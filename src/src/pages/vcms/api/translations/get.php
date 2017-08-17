<?php
use vcms\Request;
use vcms\resources\ResourceType;


if (!$_SESSION['VUser']->isAuthenticated) {
    $Feedback->failure('needs authentication');
}

switch ($QueryString->action) {

    case 'get-tags':

        if (!isset($QueryString->page_location)) {
            $Feedback->failure('needs arguments');
        }
        if (strpos($QueryString->page_location, '..') !== false) {
            $Feedback->failure('you are not allowed to access this location');
        }

        $req = new Request($QueryString->page_location, 'GET');
        /** @var \vcms\resources\Resource $res */
        $res = $req->generate_resource();

        if ($res->type !== ResourceType::WEB) {
            $Feedback->failure('the resource is not a web page');
        }

        $res->process_response();

        if (basename($res->dirpath) === '404') {
            $Feedback->failure('Page is not found');
        }

        preg_match_all('/TR[0-9]+/', $res->Response->content, $matches);
        $Feedback->success('tags fetched', $matches[0]);

}