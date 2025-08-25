<div class="w-11/12 md:w-10/12 mx-auto py-10">
    <h1>Upcoming Events</h1>

    <?php
    $args = array(
        'post_type' => 'post',
        'posts_per_page' => 3,
        'meta_key' => 'wpcf-event-from-date',
        'orderby' => 'meta_value_num',
        'order' => 'ASC',
        'meta_query' => array(
            array(
                'key' => 'wpcf-event-to-date',
                'value' => todayUnixDate(),
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

    <?php
    $post_limit = is_front_page() || is_home() ? 3 : 6;
    if ($upcoming_posts->found_posts > $post_limit) :
    ?>
        <p class="text-center">
            <a href="<?php echo get_site_url(); ?>/events#upcoming-events" class="btn red">SEE MORE UPCOMING EVENTS</a>
        </p>
    <?php
    endif;
    ?>
</div>