const apiUrl = "/api/opportunities";
const form = document.querySelector("#opportunity-form");
const list = document.querySelector("#opportunity-list");
const details = document.querySelector("#opportunity-details");
const emptyDetails = document.querySelector("#empty-details");
const message = document.querySelector("#message");
const formHeading = document.querySelector("#form-heading");
const cancelEdit = document.querySelector("#cancel-edit");
let selectedOpportunity = null;

function showMessage(text, type = "success") {
	message.textContent = text;
	message.className = `message ${type}`;
}

function escapeHtml(value) {
	return String(value).replace(/[&<>'"]/g, character => ({
		"&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
	}[character]));
}

async function request(url, options = {}) {
	const response = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
	const data = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(data.detail || "The request could not be completed.");
	return data;
}

function renderList(opportunities) {
	if (!opportunities.length) {
		list.innerHTML = '<p class="empty-state">No opportunities have been posted yet.</p>';
		return;
	}
	list.innerHTML = opportunities.map(opportunity => `
		<button class="opportunity-item ${selectedOpportunity?.id === opportunity.id ? "selected" : ""}" data-id="${opportunity.id}" type="button">
			<span class="item-title">${escapeHtml(opportunity.research_title)}</span>
			<span class="item-meta">${escapeHtml(opportunity.research_area)} · <span class="status-${opportunity.status.toLowerCase()}">${escapeHtml(opportunity.status)}</span></span>
		</button>`).join("");
	list.querySelectorAll("[data-id]").forEach(item => item.addEventListener("click", () => selectOpportunity(Number(item.dataset.id))));
}

function renderDetails(opportunity) {
	emptyDetails.classList.add("hidden");
	details.classList.remove("hidden");
	details.innerHTML = `
		<div class="detail-header"><div><p class="eyebrow">Opportunity #${opportunity.id}</p><h2>${escapeHtml(opportunity.research_title)}</h2></div><span class="status-badge status-${opportunity.status.toLowerCase()}">${escapeHtml(opportunity.status)}</span></div>
		<p class="description">${escapeHtml(opportunity.research_description)}</p>
		<dl class="detail-grid">
			<div><dt>Research area</dt><dd>${escapeHtml(opportunity.research_area)}</dd></div>
			<div><dt>Faculty member</dt><dd>${escapeHtml(opportunity.faculty_name)}</dd></div>
			<div><dt>Department</dt><dd>${escapeHtml(opportunity.department)}</dd></div>
			<div><dt>Required skills</dt><dd>${escapeHtml(opportunity.required_skills)}</dd></div>
			<div><dt>Positions</dt><dd>${opportunity.available_positions}</dd></div>
			<div><dt>Deadline</dt><dd>${escapeHtml(opportunity.application_deadline)}</dd></div>
		</dl>
		<div class="action-row"><button id="edit-button" class="button" type="button">Edit</button>${opportunity.status === "Open" ? '<button id="close-button" class="button" type="button">Close opportunity</button>' : ""}<button id="delete-button" class="button button-danger" type="button">Delete</button></div>`;
	document.querySelector("#edit-button").addEventListener("click", () => startEdit(opportunity));
	document.querySelector("#delete-button").addEventListener("click", () => deleteOpportunity(opportunity.id));
	document.querySelector("#close-button")?.addEventListener("click", () => closeOpportunity(opportunity));
}

async function loadOpportunities(selectId = null) {
	try {
		const opportunities = await request(apiUrl);
		renderList(opportunities);
		if (selectId) {
			const selected = opportunities.find(opportunity => opportunity.id === selectId);
			if (selected) { selectedOpportunity = selected; renderList(opportunities); renderDetails(selected); }
		}
	} catch (error) { showMessage(error.message, "error"); list.innerHTML = '<p class="empty-state">Unable to load opportunities.</p>'; }
}

async function selectOpportunity(id) {
	try { selectedOpportunity = await request(`${apiUrl}/${id}`); renderDetails(selectedOpportunity); await loadOpportunities(id); }
	catch (error) { showMessage(error.message, "error"); }
}

function startEdit(opportunity) {
	Object.entries(opportunity).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; });
	form.dataset.editingId = opportunity.id;
	formHeading.textContent = "Update opportunity";
	cancelEdit.classList.remove("hidden");
	form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetForm() { form.reset(); delete form.dataset.editingId; formHeading.textContent = "Create opportunity"; cancelEdit.classList.add("hidden"); }

form.addEventListener("submit", async event => {
	event.preventDefault();
	const payload = Object.fromEntries(new FormData(form).entries());
	payload.available_positions = Number(payload.available_positions);
	const editingId = form.dataset.editingId;
	try {
		const saved = await request(editingId ? `${apiUrl}/${editingId}` : apiUrl, { method: editingId ? "PUT" : "POST", body: JSON.stringify(payload) });
		resetForm(); selectedOpportunity = saved; await loadOpportunities(saved.id); renderDetails(saved);
		showMessage(editingId ? "Opportunity updated successfully." : "Opportunity created successfully.");
	} catch (error) { showMessage(error.message, "error"); }
});

async function closeOpportunity(opportunity) {
	await updateStatus(opportunity, "Closed");
}

async function updateStatus(opportunity, status) {
	try { const updated = await request(`${apiUrl}/${opportunity.id}`, { method: "PUT", body: JSON.stringify({ ...opportunity, status }) }); selectedOpportunity = updated; await loadOpportunities(updated.id); renderDetails(updated); showMessage("Opportunity status updated."); }
	catch (error) { showMessage(error.message, "error"); }
}

async function deleteOpportunity(id) {
	if (!window.confirm("Delete this research opportunity?")) return;
	try { await request(`${apiUrl}/${id}`, { method: "DELETE" }); selectedOpportunity = null; details.classList.add("hidden"); emptyDetails.classList.remove("hidden"); resetForm(); await loadOpportunities(); showMessage("Opportunity deleted successfully."); }
	catch (error) { showMessage(error.message, "error"); }
}

document.querySelector("#new-opportunity").addEventListener("click", () => { resetForm(); form.scrollIntoView({ behavior: "smooth" }); });
cancelEdit.addEventListener("click", resetForm);
loadOpportunities();
