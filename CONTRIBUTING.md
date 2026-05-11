# Contributing to Reality Hits

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Test your changes thoroughly
- Follow coding standards

## Getting Started

### 1. Fork the Repository
```bash
# Click Fork on GitHub
```

### 2. Clone Your Fork
```bash
git clone https://github.com/your-username/Reality-Hits.git
cd Reality\ Hits\ Project
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Backend Development

1. **Setup virtual environment**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Create your changes**
3. **Test your code**
```bash
# Run backend
python main.py

# Test endpoints
curl http://localhost:8000/api/health
```

4. **Follow code style**
   - Use 4 spaces for indentation
   - Use snake_case for functions and variables
   - Add docstrings to functions
   - Keep functions focused and small

### Frontend Development

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Start dev server**
```bash
npm run dev
```

3. **Create your changes**
4. **Follow code style**
   - Use 2 spaces for indentation
   - Use camelCase for variables and functions
   - Use PascalCase for components
   - Add prop types
   - Keep components small and reusable

## Making Changes

### Backend Example

```python
# routes/example.py
from fastapi import APIRouter, Depends

router = APIRouter()

@router.get("/example")
async def get_example():
    """Get example data"""
    return {"message": "Example"}
```

### Frontend Example

```jsx
// components/ExampleComponent.jsx
export default function ExampleComponent({ title }) {
  return (
    <div className="p-4">
      <h1>{title}</h1>
    </div>
  )
}
```

## Submitting Changes

### 1. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: fix bug in component"
# or
git commit -m "docs: update README"
```

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### 2. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request
- Go to GitHub
- Click "Compare & pull request"
- Provide clear description
- Reference any related issues

## Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what and why
- **Testing**: Describe how you tested
- **Screenshots**: Include for UI changes
- **Breaking Changes**: Mark if applicable

## Testing

### Backend Tests

```bash
# Install testing dependencies
pip install pytest pytest-asyncio

# Run tests
pytest tests/

# With coverage
pytest --cov=. tests/
```

### Frontend Tests

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react

# Run tests
npm run test

# With coverage
npm run test:coverage
```

## Documentation

### Updating README
- Keep it accurate
- Add examples
- Update screenshots if UI changes
- Update API docs for backend changes

### Code Comments
- Comment complex logic
- Use clear, concise language
- Update comments when code changes

## Performance Considerations

### Backend
- Use async/await properly
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize database queries

### Frontend
- Use React.memo for expensive components
- Lazy load routes
- Optimize images
- Minimize bundle size

## Security Considerations

### Backend
- Validate all inputs
- Use parameterized queries
- Don't expose sensitive errors
- Implement rate limiting

### Frontend
- Sanitize user input
- Don't store sensitive data in localStorage
- Use HTTPS only
- Validate data before sending to API

## Reporting Issues

### Bug Report
```
Title: [BUG] Short description
Description:
- Environment (OS, browser, versions)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
```

### Feature Request
```
Title: [FEATURE] Short description
Description:
- Use case
- Proposed solution
- Alternative solutions
- Additional context
```

## Questions?

- Check existing issues/discussions
- Ask in pull requests
- Comment on related issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be listed in:
- README.md
- CONTRIBUTORS.md (if created)
- Release notes

Thank you for contributing to Reality Hits! 🙏

