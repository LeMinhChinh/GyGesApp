function addToWL(self,id,title,price,images){
    if($(self).hasClass('wishlist-selected')){
      var idProduct = $(self).attr('data-id');
      var shopUrl = window.shopUrl;
      var customerId = window.customerId;
      $.ajax({
        url: 'http://localhost:8888/api/wl_delete',
        type: "GET",
        data: {
          idPr: idProduct,
          idCus: customerId,
          idShop: shopUrl
        },
        success: function(data){
          if(data.status){
            $(self).removeClass('wishlist-selected')
            $(self).removeClass('disabledIcon')
          }
        }
      })
    }else{
      var idProduct = id;
      var titleProduct = title;
      var priceProduct = price;
      var imageProduct = images;
      var shopUrl = window.shopUrl;
      var customerId = window.customerId;
      $.ajax({
        url: 'http://localhost:8888/api/product',
        type: "POST",
        data: {
          idPr: idProduct,
          titlePr: titleProduct,
          pricePr: priceProduct,
          imgPr: imageProduct,
          shopUrl: shopUrl,
          customerId: customerId
        },
        success: function(data){
          $(self).removeClass('disabledIcon')
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
          console.log('null')
          productsHTML += '<p>Bạn chưa thích sản phẩm nào</p>'
          $('#wishlist').html(productsHTML);
        }else{

          var settings = JSON.parse(data.setting)
          var product = data.wishlist.data
          var page = data.wishlist.current_page
          var dtProduct = data.dtProduct
          var totalPage = Math.ceil(data.wishlist.total/data.wishlist.per_page)

          //       if(data.handle.length > 0){
          //         for(var i=0; i< data.handle.length; i++){
          //           $.ajax({
          //             url: 'https://globolevel1.myshopify.com/products/'+data.handle[i]+'.json',
          //             type: "GET",
          //             success: function(data){
          //           		console.log(data)
          //           	}
          //           })
          //         }
          //       }

          productsHTML += '<section class="wl-product">'

          productsHTML += '<span>Show by:</span>'
          productsHTML += '<div class="form-check-inline">'
          productsHTML += '<label class="form-check-label showby">'
          productsHTML += '<input type="radio" class="form-check-input" name="optradio" checked value="list">List'
          productsHTML += '</label>'
          productsHTML += '</div>'
          productsHTML += '<div class="form-check-inline showby">'
          productsHTML += '<label class="form-check-label">'
          productsHTML += '<input type="radio" class="form-check-input" name="optradio" value="grid">Grid'
          productsHTML += '</label>'
          productsHTML += '</div>'

          productsHTML += '<div class="view-list" id="list">'
          productsHTML += '<table class="table">'
          productsHTML += '<thead>'
          productsHTML += '<tr>'
          productsHTML += '<th scope="col">Product</th>'
          if(settings.status_price == true){productsHTML += '<th scope="col">Price</th>'}
          productsHTML += '<th scope="col">In stock</th>'
          productsHTML += '<th scope="col">Add to cart</th>'
          productsHTML += '<th scope="col">Remove wishlist</th>'
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
          productsHTML += '<ul id="pagination" class="pagination"></ul>'
          productsHTML += '</div>'

          productsHTML += '<div class="view-grid" id="grid">'
          for(var i = 0; i < product.length; i++){
            productsHTML += '<div class="product">'
            productsHTML += '<div class="box-shadow">'
            productsHTML += '<div class="img-div">'
            productsHTML += '<img src="'+ product[i].image +'" alt="" class="img-pr">'
            productsHTML += '</div>'
            productsHTML += '<p class="name">'+ product[i].name +'</p>'
            if(settings.status_price == true){productsHTML += '<td>'+ product[i].price.toLocaleString('us-US', { style: 'currency', currency: 'USD' }) +'</td>'}
            productsHTML += '<div class="action">'
            productsHTML += '<div class="row">'
            productsHTML += '<div class="col-6">'
            productsHTML += '</div>'
            productsHTML += '<div class="col-6 img-action">'
            productsHTML += '</div>'
            productsHTML += '</div>'
            productsHTML += '<div>'
            productsHTML += '<a href="" class="add-cart">ADD TO CART</a>'
            productsHTML += '</div>'
            productsHTML += '</div>'
            productsHTML += '<img src="" alt="" class="img-news">'
            productsHTML += '</div>'
            productsHTML += '</div>'

          }
          productsHTML += '<div class="clear"></div>'
          productsHTML += '</div>'
          productsHTML += '</section>'

          $('#wishlist').html(productsHTML);

          $('#pagination').twbsPagination({
            totalPages: totalPage,
            visiblePages: 5,
            startPage: page,
            first: 'First',
            prev: 'Previous',
            next: 'Next',
            last: 'Last',
            initiateStartPageClick:false,
            onPageClick: function (e, page) {
              loadPage(page)
            }
          })
        }
      },
      error: function(){
        $('#wishlist').html('Something wrong');
      }
    })
  }

  $(document).ready(function(){
    $('a.add_wishlist').click(function(e){
      e.preventDefault();
      $(this).addClass('disabledIcon')
      addToWL(this, $(this).data('id'), $(this).data('title'), $(this).data('price'), $(this).data('image'));

    });
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

    if(arr_productId.length){
      $.ajax({
        url: 'http://localhost:8888/api/product_check',
        type: "GET",
        data: {
          arr_id: newArr,
          shopUrl: shopUrl,
          customerId: customerId
        },
        success: function(data){
          if(data.success){
            $.each(data.ids, function(index, id){
              $( '.add_wishlist[data-id="'+ id +'"]').addClass('wishlist-selected');
            })
          }
        }
      });
    }

    if( $('#wishlist').length ){
      var shopUrl = window.shopUrl;
      var customerId = window.customerId;
      var page = 1

      loadPage(page)

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
            if(data.status == true){
              $('tr[id="'+data.idPr+'"]').hide();
            }
          }
        })
      });
    }
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
  });
