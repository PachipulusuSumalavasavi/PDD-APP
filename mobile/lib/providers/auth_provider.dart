import 'package:flutter/material.dart';
import '../models/user_model.dart';

class AuthProvider with ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;

  void login(String email, String password, String role) {
    _isLoading = true;
    notifyListeners();

    // Mock Login Session
    _user = UserModel(
      id: 'usr-1',
      name: role == 'company' ? 'Nexus Recruiter' : (role == 'admin' ? 'Admin Officer' : 'Alex Johnson'),
      email: email,
      role: role,
      token: 'flutter-mock-jwt-token',
    );

    _isLoading = false;
    notifyListeners();
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}
