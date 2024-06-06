import 'package:sidequest-flutter/firebase_options.dart';
import 'package:sidequest-flutter/navigation.dart';
import 'package:sidequest-flutter/onboard_page.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  User? user;

  @override
  void initState() {
    super.initState();
    FirebaseAuth.instance.authStateChanges().listen((User? user2) {
      if (user2 == null) {
        print('User is currently signed out!');
      } else {
        print('User is signed in!');
      }
      setState(() {
        user = user2;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.from(
          colorScheme:
              ColorScheme.fromSeed(seedColor: const Color.fromRGBO(11, 112, 97, 1))),
      debugShowCheckedModeBanner: false,
      home: user == null ? const OnboardPage() : Navigation(),
    );
  }
}
