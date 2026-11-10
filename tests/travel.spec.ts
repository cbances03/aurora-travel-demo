import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const destinations = [
  "dolomitas",
  "madeira",
  "kyoto",
  "valle-sagrado",
  "atacama",
  "islandia",
];
const routes = [
  "/",
  "/destinos",
  "/experiencias",
  "/favoritos",
  "/planificador",
  "/creditos",
  ...destinations.map((d) => `/destinos/${d}`),
];
for (const route of routes)
  test(`ruta ${route}: acceso, imágenes y accesibilidad`, async ({ page }) => {
    test.setTimeout(45000);
    const errors: string[] = [];
    const broken: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400) broken.push(`${r.status()} ${r.url()}`);
    });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => {
      document
        .querySelectorAll("img")
        .forEach((img) => (img.loading = "eager"));
      return document.fonts.ready;
    });
    await expect
      .poll(
        () =>
          page
            .locator("img")
            .evaluateAll((images) =>
              images.every(
                (img) =>
                  (img as HTMLImageElement).complete &&
                  (img as HTMLImageElement).naturalWidth > 0,
              ),
            ),
        { timeout: 20000 },
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(errors).toEqual([]);
    expect(broken).toEqual([]);
  });
test("navegación, menú y categoría desde landing", async ({ page }) => {
  await page.goto("/");
  const menu = page.getByRole("button", { name: /^(Abrir|Cerrar) menú$/ });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  }
  await page.getByRole("link", { name: /Perderse en la montaña/ }).click();
  await expect(page).toHaveURL(/categoria=/);
  await expect(
    page.getByRole("button", { name: "Montaña", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".destination-card")).toHaveCount(1);
  await page
    .getByRole("link", { name: "Explorar Dolomitas", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Dolomitas.",
  );
  await page.getByRole("link", { name: "Volver a destinos" }).click();
  await expect(page).toHaveURL(/\/destinos$/);
});
test("búsqueda sin acentos, filtros combinados, orden y vacío", async ({
  page,
}) => {
  await page.goto("/destinos");
  await page.getByLabel("Buscar destinos").fill("peru");
  await expect(page.locator(".destination-card")).toHaveCount(1);
  await expect(page.locator(".destination-card")).toContainText(
    "Valle Sagrado",
  );
  await page.getByLabel("Filtrar por región").selectOption("Europa");
  await expect(page.locator(".destination-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Restablecer filtros" }).click();
  await expect(page.locator(".destination-card")).toHaveCount(6);
  await page.getByLabel("Ordenar destinos").selectOption("name");
  await expect(page.locator(".destination-card h3").first()).toHaveText(
    "Atacama",
  );
  await page.getByRole("button", { name: "Cultura", exact: true }).click();
  await expect(page.locator(".destination-card")).toHaveCount(2);
});
test("favoritos: guardar, recuperar y eliminar", async ({ page }) => {
  await page.goto("/destinos");
  await page
    .getByRole("button", { name: "Guardar Madeira en favoritos" })
    .click();
  await expect(
    page.getByRole("button", { name: "Quitar Madeira de favoritos" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/favoritos");
  await expect(page.locator(".destination-card")).toHaveCount(1);
  await expect(page.locator(".destination-card")).toContainText("Madeira");
  await page.reload();
  await expect(page.locator(".destination-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Quitar Madeira de favoritos" })
    .click();
  await expect(page.locator(".destination-card")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Tu colección empieza con una mirada." }),
  ).toBeVisible();
});
test("galería: navegación por botones, teclado y retorno de foco", async ({
  page,
}) => {
  await page.goto("/destinos");
  const trigger = page.getByRole("button", { name: "Abrir cuaderno visual" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Dolomitas", exact: true }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Fotografía siguiente" }).click();
  await expect(
    dialog.getByRole("heading", { name: "Madeira", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(
    dialog.getByRole("heading", { name: "Dolomitas", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
test("experiencias: búsqueda, filtro y añadir al plan", async ({ page }) => {
  await page.goto("/experiencias");
  await page.getByRole("button", { name: "Fotografía", exact: true }).click();
  await expect(page.locator(".experience-card")).toHaveCount(2);
  await page.getByLabel("Buscar experiencias").fill("desierto");
  await expect(page.locator(".experience-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Añadir al itinerario" }).click();
  await expect(page.locator(".notification.visible")).toContainText("día 1");
  await page.goto("/planificador");
  await expect(page.locator(".activity")).toContainText(
    "Horizontes del desierto",
  );
  await expect(page.locator(".trip-budget")).toContainText("140");
});
test("reservas: validación y confirmación exclusivamente simulada", async ({
  page,
}) => {
  await page.goto("/experiencias");
  await page
    .locator(".experience-card")
    .first()
    .getByRole("button", { name: "Simular reserva" })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Completar simulación" }).click();
  await expect(dialog.getByRole("alert")).toContainText("fecha válida");
  const future = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);
  await dialog.getByLabel("Fecha", { exact: true }).fill(future);
  await dialog.getByRole("button", { name: "Completar simulación" }).click();
  await expect(dialog.getByRole("alert")).toContainText("nombre");
  await dialog.getByLabel("Nombre", { exact: true }).fill("Viajero Demo");
  await dialog.getByLabel("Correo electrónico").fill("invalido");
  await dialog.getByRole("button", { name: "Completar simulación" }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "correo electrónico válido",
  );
  await dialog.getByLabel("Correo electrónico").fill("viajero@example.com");
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
  });
  await dialog.getByRole("button", { name: "Completar simulación" }).click();
  await expect(dialog).toContainText("No existe una reserva real.");
  expect(posts).toEqual([]);
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(
    "viajero@example.com",
  );
  await dialog.getByRole("button", { name: "Seguir explorando" }).click();
  await expect(dialog).toHaveCount(0);
});
test("planificador: validar detalles y conservarlos tras recarga", async ({
  page,
}) => {
  await page.goto("/planificador");
  await page.getByLabel("Nombre del viaje").fill("A");
  await page.getByRole("button", { name: "Guardar detalles" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("nombre");
  await page.getByLabel("Nombre del viaje").fill("La ruta de la calma");
  await page.getByLabel("Inicio", { exact: true }).fill("2027-05-15");
  await page.getByLabel("Final", { exact: true }).fill("2027-05-10");
  await page.getByRole("button", { name: "Guardar detalles" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "rango válido",
  );
  await page.getByLabel("Inicio", { exact: true }).fill("2027-05-10");
  await page.getByLabel("Final", { exact: true }).fill("2027-05-12");
  await page
    .locator(".trip-settings")
    .getByRole("combobox", { name: "Viajeros", exact: true })
    .selectOption("3");
  await page.getByRole("button", { name: "Guardar detalles" }).click();
  await expect(page.locator(".day-sheet")).toHaveCount(3);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "La ruta de la calma.",
  );
  await expect(page.getByLabel("Nombre del viaje")).toHaveValue(
    "La ruta de la calma",
  );
  await expect(page.locator(".day-sheet")).toHaveCount(3);
});
test("itinerario: crear, mover, editar, proteger fechas y eliminar", async ({
  page,
}) => {
  await page.goto("/planificador");
  await page
    .getByRole("button", { name: "Añadir al viaje", exact: true })
    .click();
  await expect(page.locator(".activity")).toHaveCount(1);
  await page.getByLabel("Día de Entre lagos y montañas").selectOption("1");
  await page.getByLabel("Hora de Entre lagos y montañas").fill("11:30");
  await expect(page.locator(".day-sheet").nth(1)).toContainText("11:30");
  await page.getByLabel("Final", { exact: true }).fill("2027-05-10");
  await page.getByRole("button", { name: "Guardar detalles" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "quedarían fuera",
  );
  await page
    .getByLabel("Cambiar Entre lagos y montañas")
    .selectOption("funchal");
  await expect(page.locator(".activity h4")).toHaveText(
    "Una mañana en Funchal",
  );
  await page.reload();
  await expect(page.locator(".day-sheet").nth(1)).toContainText(
    "Una mañana en Funchal",
  );
  await expect(page.locator(".trip-budget")).toContainText("90");
  await page
    .getByRole("button", { name: "Eliminar Una mañana en Funchal" })
    .click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(page.locator(".activity")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Eliminar Una mañana en Funchal" })
    .click();
  await page
    .getByRole("button", { name: "Eliminar actividad", exact: true })
    .click();
  await expect(page.locator(".activity")).toHaveCount(0);
  await expect(page.locator(".trip-budget")).toContainText("0");
});
test("restablecer viaje conserva favoritos", async ({ page }) => {
  await page.goto("/destinos");
  await page
    .getByRole("button", { name: "Guardar Kyoto en favoritos" })
    .click();
  await page.goto("/planificador");
  await page
    .getByRole("button", { name: "Añadir al viaje", exact: true })
    .click();
  await page.getByRole("button", { name: "Empezar de nuevo" }).click();
  await page
    .getByRole("button", { name: "Restablecer viaje", exact: true })
    .click();
  await expect(page.locator(".activity")).toHaveCount(0);
  await page.goto("/favoritos");
  await expect(page.locator(".destination-card")).toContainText("Kyoto");
});
test("datos corruptos y almacenamiento bloqueado", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("aurora.travel.v1", '{"trip":null}'),
  );
  await page.goto("/destinos");
  await expect(
    page.getByRole("alert").filter({ hasText: "No pudimos leer" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Guardar Madeira en favoritos" })
    .click();
  await expect(page.locator(".storage-alert")).toHaveCount(0);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page
    .getByRole("button", { name: "Guardar Kyoto en favoritos" })
    .click();
  await expect(
    page.getByRole("button", { name: "Quitar Kyoto de favoritos" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "El cambio dura solo en esta pestaña" }),
  ).toHaveCount(1);
});
test("responsive intermedio, movimiento reducido y 404", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 768, 1024]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of [
      "/",
      "/destinos",
      "/destinos/dolomitas",
      "/experiencias",
      "/planificador",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} @ ${width}`,
      ).toBe(true);
    }
  }
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  const response = await page.goto("/destinos/no-existe");
  expect(response?.status()).toBe(404);
  await page
    .getByRole("link", { name: "Explorar destinos", exact: true })
    .click();
  await expect(page).toHaveURL(/\/destinos$/);
});
test("capturas para revisión visual", async ({ page }, testInfo) => {
  for (const [name, route] of [
    ["landing", "/"],
    ["detail", "/destinos/dolomitas"],
    ["planner", "/planificador"],
  ]) {
    await page.goto(route);
    await page.evaluate(() => {
      document
        .querySelectorAll("img")
        .forEach((img) => (img.loading = "eager"));
      return document.fonts.ready;
    });
    await expect
      .poll(
        () =>
          page
            .locator("img")
            .evaluateAll((images) =>
              images.every((img) => (img as HTMLImageElement).complete),
            ),
        { timeout: 15000 },
      )
      .toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`${name}.png`),
      fullPage: true,
      animations: "disabled",
    });
  }
});
