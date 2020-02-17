<?php echo "<script>
    window.shopUrl 	= {{ shop.url | json }};
    window.customerId = {{ customer.id | json }};
</script> \n" ?>

<link rel="stylesheet" href="{{ <?php echo  "'globo.wishlist.css' | asset_url" ?> }}">

<script src="<?php echo "https://code.jquery.com/jquery-3.4.1.min.js" ?>"></script>
<script src="{{ <?php echo "'globo.wishlist.js' | asset_url" ?> }}"></script>
