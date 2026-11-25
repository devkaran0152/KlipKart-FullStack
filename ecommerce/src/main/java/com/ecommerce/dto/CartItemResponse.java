
package com.ecommerce.dto;

import java.math.BigDecimal;

public class CartItemResponse {

    private Long itemId;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal totalPrice;

    public CartItemResponse(Long itemId, Long productId,
            String productName, BigDecimal price,
            Integer quantity, BigDecimal totalPrice) {

        this.itemId = itemId;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

    public Long getItemId() {
        return itemId;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
}
