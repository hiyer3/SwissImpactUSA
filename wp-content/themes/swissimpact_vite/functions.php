<?php

require_once(__DIR__ . '/inc/widgets.php');

// Exit if accessed directly
if (!defined('ABSPATH'))
    exit;

// funtions.php is empty so you can easily track what code is needed in order to Vite + Tailwind JIT run well

add_theme_support('post-thumbnails');
 
// Main switch to get fontend assets from a Vite dev server OR from production built folder
// it is recommeded to move it into wp-config.php
define('IS_VITE_DEVELOPMENT', true);

function wpdocs_custom_excerpt_length($length)
{
    return 20;
}
add_filter('excerpt_length', 'wpdocs_custom_excerpt_length', 999);

function new_excerpt_more($more)
{
    return '...';
}
add_filter('excerpt_more', 'new_excerpt_more');

function disable_sharedaddy()
{
    add_filter('sharing_show', '__return_false');
}

add_action('init', 'disable_sharedaddy');

function register_menu()
{
    register_nav_menu('primary', __('Primary Menu', 'swiss-impact'));
    register_nav_menu('footer', __('Footer Menu', 'swiss-impact'));
}

add_action('after_setup_theme', 'register_menu');

add_filter('toolset_rest_run_exposure_filters', '__return_true');

add_action('rest_api_init', 'add_custom_fields');
function add_custom_fields()
{
    register_rest_field(
        'post',
        'custom_fields', //New Field Name in JSON RESPONSEs
        array(
            'get_callback'    => 'get_custom_fields', // custom function name 
            'update_callback' => null,
            'schema'          => null,
        )
    );
}

function get_custom_fields($object, $field_name, $request)
{
    //your code goes here
    $post_ID = $object['id'];
    $return_value = [];

    $post = get_post($post_ID);
    $return_value['hello'] = $post->post_title;

    $post_categories = get_the_category($post_ID);
    $i = 0;
    if (!empty($post_categories)) {
        foreach ($post_categories as $single_post_category) {
            $return_value['category'][$i]['slug'] = $single_post_category->slug;
            $return_value['category'][$i]['icon'] = get_term_meta($single_post_category->cat_ID, "wpcf-taxonomy-icon")[0];
            $return_value['category'][$i]['name'] = $single_post_category->name;
            $i++;
        }
    }

    $post_tags = get_the_tags($post_ID);
    if ($post_tags) {
        $i = 0;
        foreach ($post_tags as $post_tag) {
            $return_value['tags'][$i]['slug'] = $post_tag->slug;
            if (get_term_meta($post_tag->term_id, 'wpcf-location-icon')) :
                $return_value['tags'][$i]['icon'] = get_term_meta($post_tag->term_id, 'wpcf-location-icon')[0];
            endif;
            $return_value['tags'][$i]['name'] = $post_tag->name;
            $i++;
        }
    }

    return $return_value;
}

function rest_filter_by_custom_taxonomy($args, $request)
{
    if (isset($request['event'])) {
        $event_slug = sanitize_text_field($request['event']);

        if ($event_slug == "upcoming") {
            $args['meta_key'] = 'wpcf-event-from-date';
            $args['orderby'] = 'meta_value_num';
            $args['order'] = 'ASC';
            $args['meta_query'] = [
                [
                    'key' => 'wpcf-event-to-date',
                    'value' => time(),
                    'compare' => '>=',
                    'type' => 'UNSIGNED'
                ]
            ];
        }

        if ($event_slug == "past") {

            $args['meta_key'] = 'wpcf-event-from-date';
            $args['orderby'] = 'meta_value_num';
            $args['order'] = 'DESC';
            $args['meta_query'] = [
                [
                    'key' => 'wpcf-event-to-date',
                    'value' => time(),
                    'compare' => '<',
                    'type' => 'UNSIGNED'
                ]
            ];
        }
    }

    return $args;
}
add_filter('rest_post_query', 'rest_filter_by_custom_taxonomy', 10, 3);

function wpse_get_the_tags($terms)
{
    if ($terms && !is_admin()) {
        $virtual_tag = '';

        for ($i = 0; $i < count($terms); $i++) {
            if ($terms[$i]->slug == 'virtual') {
                $virtual_tag = $terms[$i];
                array_splice($terms, $i, 1);
                continue;
            }
        }

        if ($virtual_tag != '') {
            array_push($terms, $virtual_tag);
        }
    }


    return $terms;
}
add_filter('get_the_tags', 'wpse_get_the_tags', 10, 3);

function wpse_get_tags($terms)
{
    if ($terms && !is_admin()) {
        $virtual_tag = '';

        for ($i = 0; $i < count($terms); $i++) {
            if ($terms[$i]->slug == 'virtual') {
                $virtual_tag = $terms[$i];
                array_splice($terms, $i, 1);
                continue;
            }
        }

        if ($virtual_tag != '') {
            array_push($terms, $virtual_tag);
        }
    }


    return $terms;
}
add_filter('get_tags', 'wpse_get_tags', 10, 3);

// define image sizes
add_image_size('full', 1920);
add_image_size('post-item', 960);

include "inc/inc.vite.php";

// Add one day
function todayUnixDate()
{
    $today = new DateTime();
    $today->setTimestamp(current_time('timestamp'));
    $today->setTime(0, 0, 0);
    $todayUnixDate = $today->format('U');

    return $todayUnixDate;
}

// add ACF options page 
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'    => 'Theme General Settings',
        'menu_title'    => 'Theme Settings',
        'menu_slug'     => 'theme-general-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));
}

// add title tag support
add_theme_support('title-tag');
