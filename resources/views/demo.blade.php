<?php echo "{{ 'globo.formbuilder.css' | asset_url | stylesheet_tag }}" ?>
<script src="https://www.google.com/recaptcha/api.js?render=explicit&hl={{ isset($shop->settings->reCaptcha->languageCode) ? $shop->settings->reCaptcha->languageCode:'en'}}" async defer></script>
<script>
	var Globo = Globo || {};
    Globo.FormBuilder = Globo.FormBuilder || {}
    Globo.FormBuilder.url = "{{url('/')}}"
    Globo.FormBuilder.shop = {
        settings : {
            reCaptcha : {
                siteKey : '{{(isset($shop->settings->reCaptcha) && isset($shop->settings->reCaptcha->siteKey)) ? $shop->settings->reCaptcha->siteKey : false}}'
            }
        }
    }
    Globo.FormBuilder.forms = []

    <?php echo "{% if customer %}" ?>
        Globo.FormBuilder.customer = {
            id : '<?php echo "{{ customer.id }}" ?>',
            name : '<?php echo "{{ customer.name }}" ?>',
            email : '<?php echo "{{ customer.email }}" ?>'
        }
    <?php echo "{% endif %}" ?>
    Globo.FormBuilder.page = {
        title : document.title,
        href : window.location.href
    }
</script>

<script type="text/template" id="globo-formbuilder-dynamicCSS">
{% raw %}
	{!!$dynamicCSS!!}
{% endraw %}
</script>
<script type="text/template" id="globo-formbuilder-template">
{% raw %}
	{!!$template!!}
{% endraw %}
</script>
<script type="text/template" id="globo-formbuilder-element">
{% raw %}
    {!!$element!!}
{% endraw %}
</script>

@foreach($shop->formsWithoutTrashed as $form)
<?php echo "{{ 'globo.formbuilder.data.".$form->id.".js' | asset_url | script_tag }}\n" ?>
@endforeach
<?php echo "{{ 'globo.formbuilder.js' | asset_url | script_tag }}" ?>
