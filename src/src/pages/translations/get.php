<?php
use vcms\translation\TranslationsManager;


if (isset($QueryString->action)) {
    switch ($QueryString->action) {
        case 'informations':
            $informations = [
                'supported' => $Project->Config->translation_support,
                'availableLangs' => $Project->Config->langs
            ];
            $Feedback->success('informations fetched', $informations);
            break;
    }
}

/* determine the language to use */
if (!($lang = $QueryString->lang)) {
    $lang = 'fr';
}

if (array_search($lang, $Project->Config->langs) === false) {
    $Feedback->failure('this language is not set');
}

if (!isset($QueryString->pagename)) {
    $Feedback->failure('needs arguments');
}

$SQL = <<<SQL

    SELECT tr_id, translation
    FROM {$this->translations_schema}.pages p
      NATURAL INNER JOIN {$this->translations_schema}.pages_translations pt
      NATURAL LEFT JOIN {$this->translations_schema}.translations t
    WHERE t.lang=:lang AND p.name=:page;

SQL;

$manager = new TranslationsManager($Database);
$s = $manager->get_statement($SQL, ['lang' => $lang, 'page' => $QueryString->pagename]);

$Feedback->success('test', $s->fetchAll());