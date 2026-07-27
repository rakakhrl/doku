# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2026-07-27

### Added
- **Boolean Checkers in `Doku` Class**: Added `is_zero`, `is_negative`, and `is_positive` getters to easily validate money states without manually checking the raw amount.
- **Pipeline Debugging**: Introduced the `.debug(label?)` method in `DokuPipeline` to log intermediate calculation values to the console without interrupting the method chain.
- **Min/Max Utilities**: Added `min()` and `max()` static methods in `DokuOperation` to easily find the lowest and highest values from an array of `Doku` instances.
- **Comprehensive JSDoc**: Added full JSDoc documentation with English descriptions and examples across core classes (`Doku`, `DokuPipeline`, `DokuOperation`) and their respective types to improve Developer Experience (DX) and IDE autocomplete support.
