function addToWL(self,id,title,price,images){
    if($(self).hasClass('wishlist-selected')){
  //     $(self).addClass('disableItem')
      $.ajax({
        url: 'http://localhost:8888/api/wl_delete',
        type: "GET",
        data: {
          idPr: $(self).attr('data-id'),
          idCus: window.customerId,
          idShop: window.shopUrl
        },
        success: function(data){
          if(data.status){
            $(self).removeClass('wishlist-selected')
            $(self).removeClass('disableItem')
          }
        }
      })
    }else{
  //     $(self).addClass('disableItem')
      $.ajax({
        url: 'http://localhost:8888/api/product',
        type: "POST",
        data: {
          idPr: id,
          titlePr: title,
          pricePr: price,
          imgPr: images,
          shopUrl: window.shopUrl,
          customerId: window.customerId
        },
        success: function(data){
          $(self).removeClass('disableItem')
          $(self).addClass('wishlist-selected')
        }
      });
    }
  }

  function loadPage(page)
  {
    $.ajax({
      url: 'http://localhost:8888/api/getWishlist',
      type: "GET",
      data: {
        shopUrl: shopUrl,
        customerId: customerId,
        page: page
      },
      success: function(data){
        var productsHTML = ''

        if(data.status == false){
          productsHTML += '<p>Bạn chưa thích sản phẩm nào</p>'
          $('#globo_wishlist').html(productsHTML);
        }else{

          var settings = JSON.parse(data.setting)
          var page = data.wishlist.current_page
          var dtProduct = data.dtProduct
          var totalPage = Math.ceil(data.wishlist.total/data.wishlist.per_page)
          var lastPage = data.wishlist.last_page

          productsHTML += '<section class="wl-product">'

          productsHTML += '<table class="view_wishlist">'
          productsHTML += '<thead>'
          productsHTML += '<tr>'
          productsHTML += '<th>Product</th>'
          if(settings.status_price == true){productsHTML += '<th scope="col">Price</th>'}
          productsHTML += '<th>In stock</th>'
          productsHTML += '<th>Add to cart</th>'
          productsHTML += '<th>Remove wishlist</th>'
          productsHTML += '</tr>'
          productsHTML += '</thead>'
          productsHTML += '<tbody id='+page+'>'
          for(var i = 0; i < dtProduct.length; i++){
            productsHTML += '<tr id='+ dtProduct[i].handle +'>'
            productsHTML += '<td>'
            if(settings.status_image == true){productsHTML += '<img src="'+ dtProduct[i].images[0].src +'" alt="" class="img-wl">'}
            if(settings.status_title == true){productsHTML += '<p>'+ dtProduct[i].title +'</p>'}
            productsHTML += '</td>'
            if(settings.status_price == true){productsHTML += '<td>'+ dtProduct[i].variants[0].price.toLocaleString('us-US', { style: 'currency', currency: 'USD' }) +'</td>'}
            productsHTML += '<td>In stock</td>'
            productsHTML += '<td>'
            if(settings.select == 'icon_txtbg'){
              productsHTML += '<div class="bgcRadioButton" style="background-color:'+settings.valueColor+'; color:'+settings.valueColor2+'"><a><i class="fa fa-heart"></i><span>ADD TO CART</span></a></div>'
            }
            if(settings.select == 'txt_bg'){
              productsHTML += '<div class="bgcRadioButton" style="background-color:'+settings.valueColor+'; color:'+settings.valueColor2+'"><a><span>ADD TO CART</span></a></div>'
            }
            if(settings.select == 'icon_txt'){
              productsHTML += '<div class="RadioButton" style="color:'+settings.valueColor2+'"><a><i class="fa fa-heart"></i><span>ADD TO CART</span></a></div>'
            }
            if(settings.select == 'txt'){
              productsHTML += '<div class="RadioButton" style="color:'+settings.valueColor2+'"><a><span>ADD TO CART</span></a></div>'
            }
            if(settings.select == 'icon'){
              productsHTML += ' <div class="RadioButton"><a><i class="fa fa-heart" style="color:'+settings.valueColor2+'"></i></a></div>'
            }
            productsHTML += '</td>'
            productsHTML += '<td><a href="" class="wl_remove"><i class="fa fa-times"></i></a></td>'
            productsHTML += '</tr>'
          }
          productsHTML += '</tbody>'
          productsHTML += '</table>'


          productsHTML += '</section>'

          productsHTML += '<div class="center">'
          productsHTML += '<div class="paginations">'
          productsHTML += '<a href="first">First</a>'
          productsHTML += '<a href="prev">&#8249;</a>'
          for(var i=1; i <= totalPage;i++){
            productsHTML += '<a href="'+i+'">'+i+'</a>'
          }
          productsHTML += '<a href="next">&#8250;</a>'
          productsHTML += '<a href="last">Last</a>'
          productsHTML += '</div>'
          productsHTML += '</div>'

          $('#globo_wishlist').html(productsHTML);

          $('.paginations a[href="'+ page +'"]').addClass('actives')
          if(page == 1){
            $('.paginations a[href="prev"]').addClass('disableItem')
            $('.paginations a[href="first"]').addClass('disableItem')
          }
          if(page == totalPage){
            $('.paginations a[href="next"]').addClass('disableItem')
            $('.paginations a[href="last"]').addClass('disableItem')
          }

          $('body').off('click').on('click','.paginations a',function(e){
            e.preventDefault()
            var pages = $(this).attr('href')
            $('.paginations a').removeClass('actives')
            if(pages >= 1 && pages <= lastPage){
              $(this).addClass('actives')
              loadPage(pages)
            }

            if(pages == 'prev'){
              loadPage(page-1)
            }

            if(pages == 'next'){
              loadPage(page+1)
            }

            if(pages == 'first'){
              loadPage(1)
            }

            if(pages == 'last'){
              loadPage(totalPage)
            }
          })

          $('body').on('click','.showby input[type="radio"]',function() {
            if($(this).attr('value') == "list"){
              $('#list').show();
              $('#grid').hide();
            }
            if($(this).attr('value') == "grid"){
              $('#list').hide();
              $('#grid').show();
            }
          });

          $('body').on('click','.wl_remove',function(e){
            e.preventDefault();
            var handle = $(this).closest('tr').prop('id')
            $.ajax({
              url: 'http://localhost:8888/api/wl_delete',
              type: "GET",
              data: {
                idPr: handle,
                idShop: window.shopUrl,
                idCus: window.customerId
              },
              success: function(data){
                if(data.status === "success"){
                  $('tr[id="'+data.idPr+'"]').hide();
                }
              }
            })
          });
        }
      },
      error: function(){
        $('#globo_wishlist').html('Something wrong');
      }
    })
  }

  $(document).ready(function(){
    var arr_productId = [];
    var shopUrl = window.shopUrl;
    var customerId = window.customerId;

    $('.add_wishlist').each(function(index,item){
      arr_productId.push($(item).attr('data-id'))
    });

    var newArr=[];
    var foo = function(ele, index, array){
      var match=array[index];
      for(var m in newArr){
        if(newArr[m]==match)
          return true;
      }
      newArr.push(match);
    };
    arr_productId.forEach(foo);

    var info = getCookie("arr_info")
    arr_info = info == '' ? [] : JSON.parse(info)

    var handle = getCookie("arr_handle")
    arr_handle = handle == '' ? [] : JSON.parse(handle)

    console.log(arr_info)
    console.log(arr_handle)

    if(newArr.length){
      $.ajax({
        url: 'http://localhost:8888/api/product_check',
        type: "GET",
        data: {
          arr_id: newArr,
          arr_info: arr_info,
          arr_handle: arr_handle,
          shopUrl: shopUrl,
          customerId: customerId
        },
        success: function(data){
          if(data.status === 'Success'){
            $.each(data.ids, function(index, id){
              $('.add_wishlist[data-id="'+ id +'"]').addClass('wishlist-selected');
            })
            setCookie("arr_info", arr_info, 0)
            setCookie("arr_handle", arr_handle, 0)
          }

          if(data.status === 'Set cookie success'){
            $.each(data.ids_cookie, function(index, id){
              $('.add_wishlist[data-id="'+ id +'"]').addClass('wishlist-selected');
            })
          }
        }
      });
    }

    $('a.add_wishlist').click(function(e){
      e.preventDefault();
      $(self).addClass('disableItem')
      if(customerId){
        addToWL(this, $(this).data('id'), $(this).data('title'), $(this).data('price'), $(this).data('image'));
      }else{

        handle = $(this).data('id')
        info = [
          $(this).data('id'),
          $(this).data('title'),
          $(this).data('price'),
          $(this).data('image')
        ]

        arr_info = getCookie("arr_info")
        data_info = arr_info == '' ? [] : JSON.parse(arr_info)
        //       checkCookie(this, data_info, info, "arr_info")

        arr_handle = getCookie("arr_handle")
        data_handle = arr_handle == '' ? [] : JSON.parse(arr_handle)
        //       checkCookie(this, data_handle, handle, "arr_handle")

        if($(this).hasClass('wishlist-selected')){
          $(this).removeClass('wishlist-selected')

          $.each(data_info, function(index, infos){
            if(JSON.stringify(infos) == JSON.stringify(info)){
              data_info.splice(index,1)
            }
          })

          $.each(data_handle, function(index,handles){
            if(JSON.stringify(handles) == JSON.stringify(handle)){
              data_handle.splice(index,1)
            }
          })

          setCookie("arr_info", JSON.stringify(data_info), 30)
          setCookie("arr_handle", JSON.stringify(data_handle), 30)
        }else{
          $(this).addClass('wishlist-selected')
          data_info.push(info)
          data_handle.push(handle)

          setCookie("arr_info", JSON.stringify(data_info), 30)
          setCookie("arr_handle", JSON.stringify(data_handle), 30)
        }
      }
    });

    if( $('#globo_wishlist').length ){
      var shopUrl = window.shopUrl;
      var customerId = window.customerId;
      var page = 1

      loadPage(page)
    }
  });

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
