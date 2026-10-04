---
description: Skill Update
agent: build
---

Abre los archivos de este repositorio de skills en la raiz del proyecto ./$1. Necesito actualizarla o mejorarla.

- pregunta al usuario si quiere:
  - añadir una referencia
  - anadir una script
  - modificar el prompt

## Casos de uso

- Si es una referencia preguntale al usuario donde esta ubicada la referencia
- Si es un script, pregunta si el te indicara donde buscar el script o si deber crearlo.
- En caso de que solicite modificar el prompt , pregunta que informacion quiere añadir, si es una nueva seccion, o añadir a una seccion existente, en caso de que sea una seccion existente si desea eliminar esa seccion en particular y añadir la nueva.

** Nota Importante **
Debeas hacerlas preguntas paso por paso y que el usuario responda a traves de lista que yu le proporcionaras.

Ajusta el metadata.json para incluir este script en los permisos y actualiza el SKILL.md asegurándote de mantener las reglas de economía y limpieza de contexto
