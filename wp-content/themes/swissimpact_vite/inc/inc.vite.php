<?php

// Exit if accessed directly
if (!defined('ABSPATH'))
    exit;

/*
 * VITE & Tailwind JIT development
 * Inspired by https://github.com/andrefelipe/vite-php-setup
 *
 */

// dist subfolder - defined in vite.config.json
define('DIST_DEF', 'dist');

// defining some base urls and paths
define('DIST_URI', get_template_directory_uri() . '/' . DIST_DEF);
define('DIST_PATH', get_template_directory() . '/' . DIST_DEF);

// js enqueue settings
define('JS_DEPENDENCY', array()); // array('jquery') as example
define('JS_LOAD_IN_FOOTER', true); // load scripts in footer?

// deafult server address, port and entry point can be customized in vite.config.json
if (defined('IS_VITE_DEVELOPMENT') && IS_VITE_DEVELOPMENT === true) {
    define('VITE_SERVER', 'http://localhost:3000');
} else {
    define('VITE_SERVER', 'https://swissimpactusa.wpcomstaging.com');
}

define('VITE_ENTRY_POINT', '/main.js');

// enqueue hook
add_action('wp_enqueue_scripts', function () {

    if (defined('IS_VITE_DEVELOPMENT') && IS_VITE_DEVELOPMENT === true) {

        // insert hmr into head for live reload
        function vite_head_module_hook()
        {
            echo '<script type="module" crossorigin src="' . VITE_SERVER . VITE_ENTRY_POINT . '"></script>';
        }
        add_action('wp_head', 'vite_head_module_hook');
    } else {

        // production version, 'npm run build' must be executed in order to generate assets
        // ----------

        // read manifest.json to figure out what to enqueue
        $manifest = json_decode(file_get_contents(DIST_PATH . '/manifest.json'), true);

        // is ok
        if (is_array($manifest)) {

            // get first key, by default is 'main.js' but it can change
            $manifest_key = array_keys($manifest);
            if (isset($manifest_key[0])) {
                // enqueue CSS files
                if (is_array(@$manifest[$manifest_key[0]]['file'])) {
                    foreach (@$manifest[$manifest_key[0]]['file'] as $css_file) {
                        wp_enqueue_style('main-css', DIST_URI . '/' . $css_file);
                    }
                } else {
                    wp_enqueue_style('main-css', DIST_URI . '/' . @$manifest[$manifest_key[0]]['file']);
                }


                // enqueue main JS file
                $js_file = @$manifest[$manifest_key[1]]['file'];
                if (!empty($js_file)) {
                    wp_enqueue_script('main-js', DIST_URI . '/' . $js_file, JS_DEPENDENCY, '', JS_LOAD_IN_FOOTER);

                    add_filter("script_loader_tag", "add_module_to_my_script", 10, 3);
                    function add_module_to_my_script($tag, $handle, $src)
                    {
                        if ("main-js" === $handle) {
                            $tag = '<script data-scr="custom" type="module" src="' . esc_url($src) . '"></script>';
                        }

                        return $tag;
                    }
                }
            }
        }
    }
});
