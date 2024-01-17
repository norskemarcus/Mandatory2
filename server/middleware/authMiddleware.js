export function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send({ message: 'You need to be logged in to see this' }); //  401 Unauthorized response
  }
}

export function isParent(req, res, next) {
  if (req.session.user && req.session.user.role === 'Parent') {
    next();
  } else {
    res.status(403).send({ message: 'Access denied for this role' }); // 403 Forbidden response
  }
}

export function isChild(req, res, next) {
  if (req.session.user && req.session.user.role === 'Child') {
    next();
  } else {
    res.status(403).send({ message: 'Access denied for this role' });
  }
}
