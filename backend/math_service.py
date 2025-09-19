def add(a: float, b: float) -> float:
    """Suma dos números"""
    return a + b

def subtract(a: float, b: float) -> float:
    """Resta dos números"""
    return a - b

def multiply(a: float, b: float) -> float:
    """Multiplica dos números"""
    return a * b

def divide(a: float, b: float) -> float:
    """Divide dos números"""
    if b == 0:
        raise ValueError("No se puede dividir entre cero")
    return a / b

def power(a: float, b: float) -> float:
    """Eleva a a la potencia b"""
    return a ** b

def square_root(a: float) -> float:
    """Calcula la raíz cuadrada"""
    if a < 0:
        raise ValueError("No se puede calcular raíz cuadrada de número negativo")
    return a ** 0.5
