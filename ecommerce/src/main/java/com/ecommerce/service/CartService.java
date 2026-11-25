
package com.ecommerce.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.ecommerce.dto.CartItemResponse;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Customer;
import com.ecommerce.entity.Product;

import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.repository.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public CartItem addToCart(Long customerId, Long productId, Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient product stock");
        }

        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    return cartRepository.save(newCart);
                });

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    newItem.setQuantity(0);
                    return newItem;
                });

        cartItem.setQuantity(cartItem.getQuantity() + quantity);

        return cartItemRepository.save(cartItem);
    }

public List<CartItemResponse> getCart(Long customerId) {

    Cart cart = cartRepository.findByCustomerId(customerId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

    List<CartItem> cartItems =
            cartItemRepository.findByCartId(cart.getId());

    return cartItems.stream()
            .map(item -> {

                Product product = item.getProduct();

                return new CartItemResponse(
                        item.getId(),
                        product.getId(),
                        product.getName(),
                        product.getPrice(),
                        item.getQuantity(),
                        product.getPrice().multiply(
                                java.math.BigDecimal.valueOf(item.getQuantity())
                        )
                );
            })
            .collect(Collectors.toList());
}

public CartItem updateCartItem(Long itemId, Integer quantity) {

    if (quantity == null || quantity <= 0) {
        throw new RuntimeException("Quantity must be greater than zero");
    }

    CartItem cartItem = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));

    Product product = cartItem.getProduct();

    if (product.getQuantity() < quantity) {
        throw new RuntimeException("Insufficient product stock");
    }

    cartItem.setQuantity(quantity);

    return cartItemRepository.save(cartItem);
}

public void removeCartItem(Long itemId) {

    CartItem cartItem = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));

    cartItemRepository.delete(cartItem);
}

}
