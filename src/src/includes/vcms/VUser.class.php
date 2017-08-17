<?php
namespace vcms;

class VUser extends VObject
{
    /**
     * @var string
     */
    public $name;

    /**
     * @var bool
     */
    public $isAuthenticated;

    function __construct (string $username)
    {
        $this->name = $username;
        $this->isAuthenticated = false;
    }
}