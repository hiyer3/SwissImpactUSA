<?php

/**
 * Template Name: Map
 */
?>

<?php get_header(); ?>
<style>

*{
    padding: 0;
    margin: 0;
}

iframe{
    width: 100%;
    border: 0;
    height: 90vh;
}
</style>

<iframe src="<?php echo get_template_directory_uri(); ?>/swiss-impact-map/index.html"></iframe>

<?php get_footer(); ?>