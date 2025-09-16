import 'package:flutter/material.dart';
import 'cards2_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'First App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const OrderSummaryPage(),
    );
  }
}


class OrderSummaryPage extends StatelessWidget {
  const OrderSummaryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cards 1'),
        leading: Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
      ),
    drawer: AppDrawer(selectedIndex: 0),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: ListTile(
                title: const Text('Total Orders'),
                subtitle: const Text('as of July 18, 2025'),
                trailing: const Text('862', style: TextStyle(fontSize: 32)),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: ListTile(
                title: const Text('Ordered Items This Week'),
                subtitle: const Text('as of July 18, 2025'),
                trailing: const Text('156', style: TextStyle(fontSize: 32)),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: ListTile(
                title: const Text('Return Orders'),
                subtitle: const Text('as of July 18, 2025'),
                trailing: const Text('12', style: TextStyle(fontSize: 32)),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: ListTile(
                title: const Text('Fulfilled Orders This Week'),
                subtitle: const Text('as of July 18, 2025'),
                trailing: const Text('124', style: TextStyle(fontSize: 32)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AppDrawer extends StatelessWidget {
  final int selectedIndex;
  const AppDrawer({super.key, required this.selectedIndex});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Overlay background
        GestureDetector(
          onTap: () => Navigator.of(context).pop(),
          child: Container(
            color: Colors.black.withOpacity(0.4),
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.height,
          ),
        ),
        Align(
          alignment: Alignment.centerLeft,
          child: SizedBox(
            width: MediaQuery.of(context).size.width * 0.75,
            child: Drawer(
              backgroundColor: Colors.white,
              elevation: 16,
              child: SafeArea(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(left: 16, top: 16, right: 16, bottom: 8),
                      child: Row(
                        children: [
                          const Text('Menu', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.of(context).pop(),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: Column(
                        children: [
                          Material(
                            color: selectedIndex == 0 ? Colors.grey[200] : Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            elevation: selectedIndex == 0 ? 2 : 0,
                            child: ListTile(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                              title: const Text('Cards 1'),
                              onTap: () {
                                if (selectedIndex != 0) {
                                  Navigator.of(context).pushReplacement(
                                    MaterialPageRoute(builder: (context) => const OrderSummaryPage()),
                                  );
                                } else {
                                  Navigator.of(context).pop();
                                }
                              },
                            ),
                          ),
                          const SizedBox(height: 8),
                          Material(
                            color: selectedIndex == 1 ? Colors.grey[200] : Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            elevation: selectedIndex == 1 ? 2 : 0,
                            child: ListTile(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                              title: const Text('Cards 2'),
                              onTap: () {
                                if (selectedIndex != 1) {
                                  Navigator.of(context).pushReplacement(
                                    MaterialPageRoute(builder: (context) => const Cards2Page()),
                                  );
                                } else {
                                  Navigator.of(context).pop();
                                }
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
