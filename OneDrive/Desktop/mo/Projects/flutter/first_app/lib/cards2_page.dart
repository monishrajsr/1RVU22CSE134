import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'main.dart';

class Product {
  final String name;
  final String description;
  final int price;
  final String status;
  final bool isNew;
  final int unitsSold;
  final String imageUrl;

  Product({
    required this.name,
    required this.description,
    required this.price,
    required this.status,
    required this.isNew,
    required this.unitsSold,
    required this.imageUrl,
  });

  factory Product.fromCsv(List<String> fields) {
    return Product(
      name: fields[0].replaceAll('"', ''),
      description: fields[1].replaceAll('"', ''),
      price: int.tryParse(fields[2]) ?? 0,
      status: fields[3].replaceAll('"', ''),
      isNew: fields[4].toLowerCase() == 'true',
      unitsSold: int.tryParse(fields[5]) ?? 0,
      imageUrl: fields[6].replaceAll('"', ''),
    );
  }
}

class Cards2Page extends StatefulWidget {
  const Cards2Page({super.key});

  @override
  State<Cards2Page> createState() => _Cards2PageState();
}

class _Cards2PageState extends State<Cards2Page> {
  late Future<List<Product>> productsFuture;

  @override
  void initState() {
    super.initState();
    productsFuture = fetchProducts();
  }

  Future<List<Product>> fetchProducts() async {
    final response = await http.get(Uri.parse('http://interview.surya-digital.in/get-products'));
    if (response.statusCode == 200) {
      final lines = const LineSplitter().convert(response.body.trim());
      // Skip header line
      final dataLines = lines.skip(1);
      List<Product> products = [];
      for (var line in dataLines) {
        // Split CSV line, handling quoted fields
        final fields = _parseCsvLine(line);
        if (fields.length == 7) {
          products.add(Product.fromCsv(fields));
        }
      }
      return products;
    } else {
      throw Exception('Failed to load products');
    }
  }

  List<String> _parseCsvLine(String line) {
    // Simple CSV parser for quoted fields
    final regex = RegExp(r'"([^"]*)"|([^,]+)');
    final matches = regex.allMatches(line);
    return matches.map((m) => m.group(1) ?? m.group(2) ?? '').toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cards 2'),
        leading: Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
      ),
      drawer: AppDrawer(selectedIndex: 2),
      body: FutureBuilder<List<Product>>(
        future: productsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No products found'));
          }
          final products = snapshot.data!;
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
            itemCount: products.length,
            itemBuilder: (context, index) {
              final product = products[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Stack(
                      children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(18),
                            topRight: Radius.circular(18),
                          ),
                          child: Image.network(
                            product.imageUrl,
                            width: double.infinity,
                            height: 160,
                            fit: BoxFit.cover,
                          ),
                        ),
                        Positioned(
                          top: 12,
                          right: 12,
                          child: _buildBadge(product),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product.name,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            product.description,
                            style: const TextStyle(fontSize: 13, color: Color(0xFF444444)),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Icon(Icons.check_circle, size: 16, color: product.status == 'In Stock' ? Colors.green : (product.status == 'Low Stock' ? Colors.orange : Colors.red)),
                              const SizedBox(width: 4),
                              Text(
                                product.status,
                                style: TextStyle(
                                  color: product.status == 'In Stock' ? Colors.green : (product.status == 'Low Stock' ? Colors.orange : Colors.red),
                                  fontWeight: FontWeight.w500,
                                  fontSize: 13,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Icon(Icons.shopping_cart, size: 16, color: Colors.grey),
                              const SizedBox(width: 4),
                              Text(
                                'Sold: ${product.unitsSold}',
                                style: const TextStyle(fontSize: 13, color: Colors.grey),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(
                            '₹${product.price}',
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildBadge(Product product) {
    if (product.isNew) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.green,
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text('New', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w500)),
      );
    } else if (product.status == 'Out of Stock') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.red,
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text('Out of Stock', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w500)),
      );
    }
    return const SizedBox.shrink();
  }
}
