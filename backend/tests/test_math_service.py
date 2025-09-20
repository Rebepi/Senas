import pytest
from ..math_service import add, subtract, multiply, divide, power, square_root

# Pruebas para la función add
def test_add():
    assert add(2, 3) == 5.0
    assert add(-1, 1) == 0.0
    assert add(0.5, 0.5) == 1.0

# Pruebas para la función subtract
def test_subtract():
    assert subtract(5, 2) == 3.0
    assert subtract(10, 10) == 0.0
    assert subtract(0, 5) == -5.0

# Pruebas para la función multiply
def test_multiply():
    assert multiply(3, 4) == 12.0
    assert multiply(5, 0) == 0.0
    assert multiply(-2, 3) == -6.0

# Pruebas para la función divide
def test_divide():
    assert divide(10, 2) == 5.0
    assert divide(1, 4) == 0.25
    # Prueba que se levante la excepción al dividir por cero
    with pytest.raises(ValueError, match="No se puede dividir entre cero"):
        divide(10, 0)

# Pruebas para la función power
def test_power():
    assert power(2, 3) == 8.0
    assert power(5, 0) == 1.0
    assert power(4, 0.5) == 2.0 # Raíz cuadrada

# Pruebas para la función square_root
def test_square_root():
    assert square_root(9) == 3.0
    assert square_root(25) == 5.0
    assert square_root(0) == 0.0
    # Prueba que se levante la excepción al calcular raíz de número negativo
    with pytest.raises(ValueError, match="No se puede calcular raíz cuadrada de número negativo"):
        square_root(-4)
