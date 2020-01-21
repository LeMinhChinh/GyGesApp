<?php echo "<script>
    window.shopUrl 	= {{ shop.url | json }};
    window.customerId = {{ customer.id | json }};
</script> \n" ?>
<link rel="stylesheet" href="<?php echo  "https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" ?>">
<link rel="stylesheet" href="{{<?php echo  "'globo.formbuilder.lib.css' | asset_url" ?> }}">
<link rel="stylesheet" href="{{<?php echo  "'globo.formbuilder.css' | asset_url" ?> }}">
<link href="<?php echo "https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,
700,700i,800,800i,900,900i|Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,
900i&display=swap&subset=cyrillic,cyrillic-ext,latin-ext,vietnamese" ?>" rel="stylesheet">

<script src="{{<?php echo "'globo.formbuilder.lib.js' | asset_url" ?>}}"></script>
<script src="<?php echo "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" ?> "></script>
<script src="<?php echo "//code.jquery.com/jquery.min.js" ?> "></script>
<script src="{{ <?php echo "'globo.formbuilder.pagination.js' | asset_url" ?> }}"></script>
<script src="{{ <?php echo "'globo.formbuilder.js' | asset_url" ?> }}"></script>
