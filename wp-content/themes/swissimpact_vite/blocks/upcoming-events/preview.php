<div class="w-11/12 md:w-10/12 mx-auto py-10 events">
    <h1>Upcoming Events</h1>

    <?php
    $args = array(
        'post_type' => 'post',
        'posts_per_page' => 3,
        'meta_key' => 'wpcf-event-to-date',
        'orderby' => 'meta_value_num',
        'order' => 'ASC',
        'meta_query' => array(
            array(
                'key' => 'wpcf-event-from-date',
                'value' => time(),
                'compare' => '>=',
                'type' => 'UNSIGNED'
            )
        ),
    );

    $upcoming_posts = new WP_Query($args);
    ?>

    <?php
    if ($upcoming_posts->have_posts()) :
    ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <?php
            while ($upcoming_posts->have_posts()) : $upcoming_posts->the_post();
                echo get_template_part('template-parts/get', 'post');
            endwhile;
            ?>
        </div>
    <?php else : ?>
        <div class="grid grid-cols-1 gap-x-16 gap-y-10 mb-5">
            <h3>Check back soon for upcoming events.</h3>
        </div>
    <?php endif; ?>

    <p class="text-center">
        <a href="<?php echo get_site_url(); ?>/events" class="btn">SEE ALL UPCOMING EVENTS</a>
    </p>
</div>
<style>
    .events .grid {
        display: flex;
        flex-flow: wrap;
        gap: 10px;
    }

    .events .grid>div {
        width: 31%;
    }

    .events .grid .tags{
        display: flex;
        gap: 10px;
    }

    .events .grid .tags img{
        max-width: 30px;
    }

    .events .flex.flex-col.gap-2.my-2{
        display: flex;
        margin-bottom: 10px;
        gap: 5px;
        flex-wrap: wrap;
    }

    .events .flex.flex-col.gap-2.my-2 a{
        display: flex;
        gap: 5px
    }

    .events .flex.flex-col.gap-2.my-2 a img{
        max-width: 20px;
    }

    .events .flex.flex-col.gap-2.my-2 a h5{
        margin: 0;
    }

    .events a{
        pointer-events: none;
    }
</style>