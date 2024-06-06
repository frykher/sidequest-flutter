import 'package:course_guide/account.dart';
import 'package:course_guide/coursedetails.dart';
import 'package:course_guide/courses.dart';
import 'package:course_guide/favorites.dart';
import 'package:course_guide/firebase_options.dart';
import 'package:course_guide/login.dart';
import 'package:course_guide/navigation.dart';
import 'package:course_guide/onboard_page.dart';
import 'package:course_guide/sign_up.dart';
import 'package:course_guide/utils.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _coursesNavigatorKey = GlobalKey<NavigatorState>();
final _favoritesNavigatorKey = GlobalKey<NavigatorState>();
final _accountNavigatorKey = GlobalKey<NavigatorState>();

final router = GoRouter(
  initialLocation: '/courses',
  navigatorKey: _rootNavigatorKey,
  refreshListenable:
      GoRouterRefreshListenable(FirebaseAuth.instance.authStateChanges()),
  redirect: (context, state) {
    final user = FirebaseAuth.instance.currentUser;
    const protectedRoutes = ['/courses', '/account', '/favorites'];
    bool isRestricted = protectedRoutes.contains(state.matchedLocation);
    if (user == null) {
      if (isRestricted) {
        return '/';
      }
    }
    return null;
  },
  routes: [
    GoRoute(
        path: '/',
        builder: (context, state) {
          return const OnboardPage();
        },
        routes: [
          GoRoute(
            path: 'login',
            builder: (context, state) {
              return const LoginDemo();
            },
          ),
          GoRoute(
            path: 'signup',
            builder: (context, state) {
              return const SignupPage();
            },
          ),
        ]),
    StatefulShellRoute.indexedStack(
      builder: ((context, state, navigationShell) {
        return PageWithNavBar(navigationShell: navigationShell);
      }),
      branches: [
        StatefulShellBranch(
          navigatorKey: _coursesNavigatorKey,
          routes: <RouteBase>[
            GoRoute(
              path: '/courses',
              builder: (context, state) {
                return const CoursePage();
              },
              routes: [
                GoRoute(
                  path: ':courseId',
                  builder: (context, state) {
                    return CourseDetailsPage(courseId: state.pathParameters['courseId']!);
                  },
                ),
              ]
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _favoritesNavigatorKey,
          routes: <RouteBase>[
            GoRoute(
              path: '/favorites',
              builder: (context, state) {
                return const FavoritesPage();
              },
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _accountNavigatorKey,
          routes: <RouteBase>[
            GoRoute(
              path: '/account',
              builder: (context, state) {
                return const AccountPage();
              },
            ),
          ],
        ),
      ],
    ),
  ],
);

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      theme: ThemeData.from(
          colorScheme: ColorScheme.fromSeed(
              seedColor: const Color.fromRGBO(11, 112, 97, 1))),
      debugShowCheckedModeBanner: false,
      routerConfig: router,
    );
  }
}