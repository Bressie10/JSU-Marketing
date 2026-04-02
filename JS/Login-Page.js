document.addEventListener('DOMContentLoaded', function() {
  
  if (!window.supabaseClient) {
    window.supabaseClient = supabase.createClient(
      "https://zluprfqjvlelcvoeqpnx.supabase.co",
      "sb_publishable_0ldJX2nH9zngplwZKU6AKQ_pobyL6sI"
    );
  }
  
  const supabaseClient = window.supabaseClient;

  const authDiv = document.getElementById("auth");
  const dashboardDiv = document.getElementById("dashboard");
  const invoiceList = document.getElementById("invoiceList");
  const requestHistoryList = document.getElementById("requestHistoryList");
  const websiteDiv = document.getElementById("clientWebsite");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorP = document.getElementById("errorP");
  const requestMessage = document.getElementById("requestMessage");
  const submitRequestBtn = document.getElementById("submitRequestBtn");
  const expandHistoryBtn = document.getElementById("expandHistoryBtn");
  const requestHistoryPanel = document.getElementById("requestHistoryPanel");
  const requestCount = document.getElementById("requestCount");
  const pendingPostsList = document.getElementById("pendingPostsList");
  const pendingPostsCount = document.getElementById("pendingPostsCount");

  let currentUserId = null;
  let currentUserEmail = null;
  const postDataMap = new Map();

  function showError(message) {
    if (errorP) {
      errorP.textContent = message;
      errorP.style.display = "block";
      errorP.classList.add("show");
      setTimeout(() => {
        errorP.classList.remove("show");
        setTimeout(() => {
          errorP.style.display = "none";
        }, 300);
      }, 5000);
    }
  }

  function showSuccess(message) {
    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.classList.add("fade-out");
      setTimeout(() => successDiv.remove(), 300);
    }, 3000);
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) + 
             " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  if (document.getElementById("loginBtn")) {
    document.getElementById("loginBtn").onclick = async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        showError("Please enter both email and password");
        return;
      }

      if (!validateEmail(email)) {
        showError("Please enter a valid email address");
        return;
      }

      if (password.length < 6) {
        showError("Password must be at least 6 characters");
        return;
      }

      const loginBtn = document.getElementById("loginBtn");
      const originalText = loginBtn.innerHTML;
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          showError(error.message || "Login failed. Please try again.");
          loginBtn.disabled = false;
          loginBtn.innerHTML = originalText;
        } else {
          currentUserId = data.user.id;
          authDiv.style.display = "none";
          dashboardDiv.style.display = "block";
          if (requestMessage) requestMessage.value = "";
          await loadDashboard();
          showSuccess("Welcome back!");
        }
      } catch (err) {
        showError("An unexpected error occurred. Check console.");
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalText;
      }
    };
  }

  if (passwordInput) {
    passwordInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        document.getElementById("loginBtn").click();
      }
    });
  }

  if (document.getElementById("logoutBtn")) {
    document.getElementById("logoutBtn").onclick = async () => {
      const logoutBtn = document.getElementById("logoutBtn");
      logoutBtn.disabled = true;
      logoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging out...';

      try {
        await supabaseClient.auth.signOut();
        dashboardDiv.style.display = "none";
        authDiv.style.display = "block";
        currentUserId = null;
        
        if (emailInput) emailInput.value = "";
        if (passwordInput) passwordInput.value = "";
        
        logoutBtn.disabled = false;
        logoutBtn.innerHTML = '<i class="fa-solid fa-sign-out-alt"></i> Log Out';
        
        showSuccess("Logged out successfully");
      } catch (err) {
        showError("Logout failed");
        logoutBtn.disabled = false;
        logoutBtn.innerHTML = '<i class="fa-solid fa-sign-out-alt"></i> Log Out';
      }
    };
  }

  if (submitRequestBtn) {
    submitRequestBtn.onclick = async () => {
      if (!requestMessage) {
        alert("Error: Request textarea not found");
        return;
      }

      const message = requestMessage.value.trim();

      if (!message) {
        showError("Please enter a request");
        return;
      }

      if (message.length < 20) {
        showError("Please provide more detail in your request (at least 20 characters)");
        return;
      }

      if (message.length > 1000) {
        showError("Request is too long (maximum 1000 characters)");
        return;
      }

      if (!currentUserId) {
        showError("You must be logged in to submit a request");
        return;
      }

      const originalText = submitRequestBtn.innerHTML;
      submitRequestBtn.disabled = true;
      submitRequestBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      try {
        const { data, error } = await supabaseClient
          .from("requests")
          .insert({
            client_id: currentUserId,
            message: message,
            status: "pending"
          });

        if (error) {
          showError("Failed to submit request: " + (error.message || JSON.stringify(error)));
        } else {
          await notifyNewRequest(message);
          showSuccess("Request submitted successfully! We'll review it shortly.");
          requestMessage.value = "";
          await loadRequestHistory();
        }
      } catch (err) {
        showError("An unexpected error occurred. Check console for details.");
      } finally {
        submitRequestBtn.disabled = false;
        submitRequestBtn.innerHTML = originalText;
      }
    };
  }

  if (requestMessage) {
    requestMessage.addEventListener("keypress", function(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitRequestBtn.click();
      }
    });
  }

  async function notifyNewRequest(message) {
    try {
      const body = new URLSearchParams({
        form_type:    'new_request',
        client_email: currentUserEmail || '',
        message:      message
      });
      const res = await fetch('/FormReplies.php', { method: 'POST', body });
      const text = await res.text();
      console.log('[notify] status:', res.status, 'response:', text);
    } catch (e) {
      console.error('[notify] fetch error:', e);
    }
  }

  async function notifyPostReview(action, post, notes) {
    try {
      const body = new URLSearchParams({
        form_type:     'post_review',
        action:        action,
        platform:      post.platform     || '',
        caption:       post.caption      || '',
        scheduled_for: post.scheduled_for || '',
        client_notes:  notes             || ''
      });
      await fetch('/FormReplies.php', { method: 'POST', body });
    } catch (e) {
      // Non-critical — don't surface to client
    }
  }

  if (pendingPostsList) {
    pendingPostsList.addEventListener("click", async function(e) {
      const approveBtn = e.target.closest(".btn-approve");
      const declineToggle = e.target.closest(".btn-decline-toggle");
      const declineSubmit = e.target.closest(".btn-decline-submit");

      if (approveBtn) {
        const postId = approveBtn.dataset.postId;
        approveBtn.disabled = true;
        approveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        const { error } = await supabaseClient
          .from("social_posts")
          .update({ status: "approved", reviewed_at: new Date().toISOString() })
          .eq("id", postId);

        if (error) {
          showError("Failed to approve post. Please try again.");
          approveBtn.disabled = false;
          approveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Approve';
        } else {
          const post = postDataMap.get(postId);
          if (post) await notifyPostReview('approved', post, '');
          showSuccess("Post approved!");
          await loadPendingPosts();
        }
      }

      if (declineToggle) {
        const postId = declineToggle.dataset.postId;
        const form = document.getElementById("decline-form-" + postId);
        if (form) {
          form.style.display = form.style.display === "none" ? "block" : "none";
        }
      }

      if (declineSubmit) {
        const postId = declineSubmit.dataset.postId;
        const notes = document.getElementById("decline-notes-" + postId)?.value.trim();

        if (!notes) {
          showError("Please enter improvement notes before submitting.");
          return;
        }

        declineSubmit.disabled = true;
        declineSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        const { error } = await supabaseClient
          .from("social_posts")
          .update({
            status: "declined",
            client_notes: notes,
            reviewed_at: new Date().toISOString()
          })
          .eq("id", postId);

        if (error) {
          showError("Failed to submit decline. Please try again.");
          declineSubmit.disabled = false;
          declineSubmit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Decline';
        } else {
          const post = postDataMap.get(postId);
          if (post) await notifyPostReview('declined', post, notes);
          showSuccess("Decline submitted. We'll review your notes.");
          await loadPendingPosts();
        }
      }
    });
  }

  if (expandHistoryBtn) {
    expandHistoryBtn.onclick = () => {
      const isExpanded = requestHistoryPanel.classList.contains("expanded");
      
      if (isExpanded) {
        requestHistoryPanel.classList.remove("expanded");
        expandHistoryBtn.classList.remove("expanded");
        expandHistoryBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i> View History';
      } else {
        requestHistoryPanel.classList.add("expanded");
        expandHistoryBtn.classList.add("expanded");
        expandHistoryBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Hide History';
      }
    };
  }

  async function loadPendingPosts() {
    if (!pendingPostsList) return;

    try {
      const { data: posts, error } = await supabaseClient
        .from("social_posts")
        .select("*")
        .eq("client_id", currentUserId)
        .eq("status", "pending_approval")
        .order("scheduled_for", { ascending: true });

      if (error) {
        pendingPostsList.innerHTML = '<p class="empty-state"><i class="fa-solid fa-exclamation-triangle"></i> Error loading posts</p>';
        return;
      }

      if (pendingPostsCount) pendingPostsCount.textContent = posts.length;

      postDataMap.clear();
      posts.forEach(post => postDataMap.set(post.id, post));

      if (posts.length === 0) {
        pendingPostsList.innerHTML = '<p class="empty-state"><i class="fa-solid fa-check-circle"></i> No posts waiting for your approval.</p>';
        return;
      }

      pendingPostsList.innerHTML = posts.map(post => {
        const scheduledDate = post.scheduled_for
          ? new Date(post.scheduled_for).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
          : "Not scheduled";

        const platformIcon = post.platform.toLowerCase().replace(/\s/g, '-');

        return `
          <li class="post-item" data-post-id="${post.id}">
            <div class="post-meta">
              <span class="post-platform"><i class="fa-brands fa-${platformIcon}"></i> ${post.platform}</span>
              <span class="post-date"><i class="fa-solid fa-calendar"></i> ${scheduledDate}</span>
            </div>
            ${post.image_url ? `<a href="${post.image_url}" target="_blank" class="post-media-link"><i class="fa-solid fa-photo-film"></i> View Post Media</a>` : ''}
            <p class="post-caption">${post.caption}</p>
            <div class="post-actions">
              <button class="btn btn-approve" data-post-id="${post.id}">
                <i class="fa-solid fa-check"></i> Approve
              </button>
              <button class="btn-decline-toggle" data-post-id="${post.id}">
                <i class="fa-solid fa-xmark"></i> Decline
              </button>
            </div>
            <div class="decline-form" id="decline-form-${post.id}" style="display:none;">
              <label for="decline-notes-${post.id}">Improvement notes <span class="required">*</span></label>
              <textarea id="decline-notes-${post.id}" placeholder="Please explain what needs to be changed..." rows="3"></textarea>
              <button class="btn btn-decline-submit" data-post-id="${post.id}">
                <i class="fa-solid fa-paper-plane"></i> Submit Decline
              </button>
            </div>
          </li>
        `;
      }).join("");
    } catch (err) {
      pendingPostsList.innerHTML = '<p class="empty-state"><i class="fa-solid fa-exclamation-triangle"></i> Error loading posts</p>';
    }
  }

  async function loadRequestHistory() {
    try {
      const { data: requests, error } = await supabaseClient
        .from("requests")
        .select("*")
        .eq("client_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        if (requestHistoryList) {
          requestHistoryList.innerHTML = '<p class="empty-state"><i class="fa-solid fa-exclamation-triangle"></i> Error loading requests</p>';
        }
        return;
      }

      const pendingCount = requests.filter(r => r.status === "pending").length;
      if (requestCount) {
        requestCount.textContent = pendingCount;
      }

      if (requestHistoryList) {
        if (requests.length === 0) {
          requestHistoryList.innerHTML = '<p class="empty-state"><i class="fa-solid fa-inbox"></i> No requests yet. Submit your first request above!</p>';
        } else {
          requestHistoryList.innerHTML = requests
            .map((r, index) => {
              const formattedDate = formatDate(r.created_at);
              const statusClass = r.status === "pending" ? "pending" : r.status === "completed" ? "completed" : "in-progress";
              const statusIcon = r.status === "pending" ? "fa-clock" : r.status === "completed" ? "fa-check-circle" : "fa-hourglass-half";
              
              return `
                <li class="request-item ${statusClass}" data-index="${index}">
                  <div class="request-header">
                    <div class="request-status">
                      <i class="fa-solid ${statusIcon}"></i>
                      <span class="status-label">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                    </div>
                    <span class="request-date">${formattedDate}</span>
                  </div>
                  <p class="request-text">${r.message}</p>
                  
                  ${r.response ? `
                    <div class="request-response">
                      <div class="response-label">
                        <i class="fa-solid fa-reply"></i> Response from JSU Marketing
                      </div>
                      <p class="response-text">${r.response}</p>
                      <span class="response-date">
                        Responded ${r.response_date ? formatDate(r.response_date) : 'recently'}
                      </span>
                    </div>
                  ` : ''}
                </li>
              `;
            })
            .join("");
        }
      }
    } catch (err) {
      if (requestHistoryList) {
        requestHistoryList.innerHTML = '<p class="empty-state"><i class="fa-solid fa-exclamation-triangle"></i> Error loading requests</p>';
      }
    }
  }

  async function loadDashboard() {
    try {
      const { data: userData, error: userError } = await supabaseClient.auth.getUser();
      if (userError) {
        showError("Failed to load user data");
        return;
      }

      currentUserId = userData.user.id;
      currentUserEmail = userData.user.email || '';

      const { data: client, error: clientError } = await supabaseClient
        .from("clients")
        .select("website_url, client_type")
        .eq("id", currentUserId)
        .maybeSingle();

      const clientType = client?.client_type || "both";
      const isWebsite = clientType === "website" || clientType === "both";
      const isSocial  = clientType === "social_media" || clientType === "both";

      const websiteCard  = document.getElementById("websiteCard");
      const postsCard    = document.getElementById("postsCard");
      const invoicesCard = document.getElementById("invoicesCard");

      if (websiteCard)  websiteCard.style.display  = isWebsite ? "" : "none";
      if (postsCard)    postsCard.style.display     = isSocial  ? "" : "none";

      if (isWebsite) {
        if (clientError) {
          if (websiteDiv) {
            websiteDiv.innerHTML = '<p class="empty-state"><i class="fa-solid fa-circle-exclamation"></i> Error loading website</p>';
          }
        } else if (client?.website_url) {
          if (websiteDiv) {
            websiteDiv.innerHTML = `<a href="${client.website_url}" target="_blank" class="website-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Your Website</a>`;
          }
        } else {
          if (websiteDiv) {
            websiteDiv.innerHTML = '<p class="empty-state"><i class="fa-solid fa-circle-info"></i> No website assigned yet. Contact our team!</p>';
          }
        }
      }

      const { data: invoices, error: invoicesError } = await supabaseClient
        .from("invoices")
        .select("*")
        .eq("client_id", currentUserId)
        .order("created_at", { ascending: false });

      if (invoicesError) {
        if (invoiceList) {
          invoiceList.innerHTML = '<p class="empty-state"><i class="fa-solid fa-exclamation-triangle"></i> Error loading invoices</p>';
        }
      } else if (invoices.length === 0) {
        if (invoiceList) {
          invoiceList.innerHTML = '<p class="empty-state"><i class="fa-solid fa-inbox"></i> No invoices yet</p>';
        }
      } else {
        if (invoiceList) {
          invoiceList.innerHTML = invoices
            .map(inv => {
              const statusClass = inv.status === "paid" ? "paid" : inv.status === "pending" ? "pending" : "overdue";
              const statusIcon = inv.status === "paid" ? "fa-check-circle" : inv.status === "pending" ? "fa-clock" : "fa-exclamation-circle";
              const date = new Date(inv.created_at).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
              const fileName = inv.invoice_url.split('/').pop().replace(/\.[^/.]+$/, "");

              return `
                <li class="invoice-item">
                  <div class="invoice-content">
                    <div>
                      <a href="${inv.invoice_url}" target="_blank" class="invoice-link"><i class="fa-solid fa-file-pdf"></i> ${fileName}</a>
                      <span class="invoice-date">${date}</span>
                    </div>
                  </div>
                  <span class="invoice-status ${statusClass}">
                    <i class="fa-solid ${statusIcon}"></i> ${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </li>
              `;
            })
            .join("");
        }
      }

      if (isSocial) await loadPendingPosts();
      await loadRequestHistory();
    } catch (err) {
      showError("An error occurred while loading your dashboard");
    }
  }

  (async () => {
    try {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      if (sessionData?.session) {
        currentUserId = sessionData.session.user.id;
        authDiv.style.display = "none";
        dashboardDiv.style.display = "block";
        await loadDashboard();
      }
    } catch (err) {
      console.log("Session check completed");
    }
  })();

});