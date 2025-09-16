import 'package:flutter/material.dart';

class OrderSummaryPage extends StatelessWidget {
  final int totalOrders;
  final int orderedItemsThisWeek;
  final int returnOrders;
  final int fulfilledOrdersThisWeek;
  final String date;

  const OrderSummaryPage({
    Key? key,
    required this.totalOrders,
    required this.orderedItemsThisWeek,
    required this.returnOrders,
    required this.fulfilledOrdersThisWeek,
    required this.date,
  }) : super(key: key);

  Widget _buildCard(String title, int value, String date) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
            const SizedBox(height: 8),
            Text('$value', style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('as of $date', style: const TextStyle(fontSize: 12, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Order Summary'),
        centerTitle: true,
        elevation: 0,
      ),
      body: ListView(
        children: [
          const SizedBox(height: 24),
          _buildCard('Total Orders', totalOrders, date),
          _buildCard('Ordered Items This Week', orderedItemsThisWeek, date),
          _buildCard('Return Orders', returnOrders, date),
          _buildCard('Fulfilled Orders This Week', fulfilledOrdersThisWeek, date),
        ],
      ),
    );
  }
}
