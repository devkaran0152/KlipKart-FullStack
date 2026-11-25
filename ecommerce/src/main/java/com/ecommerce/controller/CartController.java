
package com.ecommerce.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import com.ecommerce.dto.CartItemResponse;
import com.ecommerce.entity.CartItem;
import com.ecommerce.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/{customerId}/items")
    public CartItem addToCart(
            @PathVariable Long customerId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        return cartService.addToCart(customerId, productId, quantity);
    }
    @GetMapping("/{customerId}")
    public List<CartItemResponse> getCart(
            @PathVariable Long customerId) {

        return cartService.getCart(customerId);
    }

@PutMapping("/items/{itemId}")
public CartItem updateCartItem(
        @PathVariable Long itemId,
        @RequestParam Integer quantity) {

    return cartService.updateCartItem(itemId, quantity);
}

@DeleteMapping("/items/{itemId}")
public String removeCartItem(@PathVariable Long itemId) {

    cartService.removeCartItem(itemId);

    return "Product removed from cart successfully";
}

}
