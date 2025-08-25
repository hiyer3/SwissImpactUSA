<?php
/*
Template Name: Swiss Impact Map
*/
?>
<?php get_header(); ?>

<style>
    * {
        padding: 0;
        margin: 0;
    }

    .iframe-wrapper {
        width: 100%;
        height: 84vh;
        margin-bottom: 100px;
    }

    iframe {
        width: 100%;
        border: 0;
        height: 100%;
        border-bottom: 2px solid red;
    }
</style>

<?php if (types_render_termmeta('introduction')) : ?>
    <div class="w-11/12 post-content md:w-10/12 mx-auto py-10">
        <?php
        echo types_render_termmeta('introduction');
        ?>
    </div>
<?php endif; ?>

<div class="iframe-wrapper">
    <Object data="<?php echo get_template_directory_uri(); ?>/swiss-impact-map/dist/index.html" height="100%" width="100%"></object>
</div>

<?php get_footer(); ?>