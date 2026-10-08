"""Extrae el catálogo oficial de las tres planillas descargadas de AGESIC.
Uso: python extraer-mcu-agesic.py carpeta_planillas archivo_salida.ts
Requiere openpyxl para lectura; no modifica las planillas.
"""
import collections
import hashlib
import json
import pathlib
import re
import sys
import warnings
import openpyxl

warnings.filterwarnings('ignore', category=UserWarning, module='openpyxl')
carpeta, salida = map(pathlib.Path, sys.argv[1:])
catalogo = {}
fuentes = {}
for perfil in ['Básico', 'Estándar', 'Avanzado']:
    archivo = carpeta / f'{perfil}.xlsx'
    libro = openpyxl.load_workbook(archivo, read_only=True, data_only=True)
    asociaciones = collections.defaultdict(set)
    funcion = None
    for fila in libro['Madurez Subcategoría'].values:
        if fila[0] in ['Gobernar', 'Identificar', 'Proteger', 'Detectar', 'Responder', 'Recuperar']:
            funcion = fila[0]
        if not funcion:
            continue
        for valor in fila[7:11]:
            if isinstance(valor, str):
                coincidencia = re.match(r'^([A-Z]+\.\d+-\d+)\s*:', valor.strip())
                if coincidencia:
                    asociaciones[coincidencia[1]].add(funcion)
    cantidad = 0
    for fila in libro['Cumplimiento'].values:
        if not isinstance(fila[1], str):
            continue
        coincidencia = re.match(r'^([A-Z]+\.\d+-\d+)\s*:\s*(.*)', fila[1].strip(), re.S)
        if not coincidencia:
            continue
        identificador, tema = coincidencia.groups()
        if str(fila[3]).strip().lower() not in ['si', 'sí']:
            continue
        assert asociaciones[identificador], f'Sin función: {identificador}'
        funciones = sorted(asociaciones[identificador])
        if identificador not in catalogo:
            catalogo[identificador] = dict(controlId=identificador, tema=tema.strip(), funciones=funciones, perfiles=[], evidenciaNecesaria='Registrar una referencia verificable de la organización para este control.', demostracionSugerida='Describir cómo se verifica el control y su evidencia en la organización.')
        assert catalogo[identificador]['tema'] == tema.strip(), f'Texto diferente: {identificador}'
        assert catalogo[identificador]['funciones'] == funciones, f'Funciones diferentes: {identificador}'
        catalogo[identificador]['perfiles'].append(perfil)
        cantidad += 1
    fuentes[perfil] = dict(archivo=archivo.name, sha256=hashlib.sha256(archivo.read_bytes()).hexdigest(), controles=cantidad)
    libro.close()
assert [fuentes[p]['controles'] for p in fuentes] == [165, 234, 309]
salida.write_text('// Fuente: planillas MCU 5.0 AGESIC, columna Línea Base = Si.\n// Generado con scripts/extraer-mcu-agesic.py; no editar manualmente.\nexport const FUENTES_MCU_AGESIC = '+json.dumps(fuentes, ensure_ascii=False, indent=2)+';\nexport const CONTROLES_MCU_AGESIC = '+json.dumps(list(catalogo.values()), ensure_ascii=False, indent=2)+';\n', encoding='utf-8')
print(json.dumps(fuentes, ensure_ascii=True))
