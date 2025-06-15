    document.addEventListener('DOMContentLoaded', function() {
            const body = document.body;
            const cursor = document.getElementById('cursor');
            const starsContainer = document.getElementById('stars');
            const leafCount = 30; // Barglar sonini ko'paytirdik
            const leaves = [];
            let mouseX = 0;
            let mouseY = 0;
            let cursorX = 0;
            let cursorY = 0;
            
            // Yulduzchalarni yaratish
            function createStars() {
                const starCount = 200;
                for (let i = 0; i < starCount; i++) {
                    const star = document.createElement('div');
                    star.className = 'star';
                    
                    // Tasodifiy o'lcham va pozitsiya
                    const size = Math.random() * 3;
                    star.style.width = `${size}px`;
                    star.style.height = `${size}px`;
                    star.style.left = `${Math.random() * 100}%`;
                    star.style.top = `${Math.random() * 100}%`;
                    
                    // Animatsiya davomiyligi
                    star.style.setProperty('--duration', `${Math.random() * 5 + 3}s`);
                    
                    // Tasodifiy rang (ba'zi yulduzlar rangli bo'ladi)
                    if (Math.random() > 0.7) {
                        const hue = Math.random() * 360;
                        star.style.backgroundColor = `hsl(${hue}, 100%, 80%)`;
                    }
                    
                    starsContainer.appendChild(star);
                }
            }
            
            createStars();
            
            // Kursorni kuzatish
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                cursor.style.left = `${mouseX}px`;
                cursor.style.top = `${mouseY}px`;
            });

            // Barglarni yaratish
            for (let i = 0; i < leafCount; i++) {
                const leaf = document.createElement('div');
                leaf.className = 'leaf';
                leaf.style.opacity = '0';
                leaf.style.left = `${mouseX}px`;
                leaf.style.top = `${mouseY}px`;
                leaf.style.animationDelay = `${i * 0.05}s`;
                body.appendChild(leaf);
                leaves.push({
                    element: leaf,
                    x: mouseX,
                    y: mouseY,
                    delay: i * 50,
                    angle: Math.random() * Math.PI * 2,
                    size: 0.8 + Math.random() * 0.4
                });
            }

            // Animatsiya
            function animate() {
                // Kursorni sekin harakatlanishi
                cursorX += (mouseX - cursorX) * 0.1;
                cursorY += (mouseY - cursorY) * 0.1;
                
                // Har bir bargni harakatlantirish
                leaves.forEach((leaf, index) => {
                    const leader = index === 0 ? 
                        { x: cursorX, y: cursorY } : 
                        { x: leaves[index-1].x, y: leaves[index-1].y };
                    
                    // Yangi pozitsiya
                    leaf.x += (leader.x - leaf.x) * (0.03 + index * 0.003);
                    leaf.y += (leader.y - leaf.y) * (0.03 + index * 0.003);
                    
                    // Aylanish
                    const targetAngle = Math.atan2(leader.y - leaf.y, leader.x - leaf.x);
                    leaf.angle += (targetAngle - leaf.angle) * 0.1;
                    
                    // Elementni yangilash
                    leaf.element.style.left = `${leaf.x}px`;
                    leaf.element.style.top = `${leaf.y}px`;
                    leaf.element.style.transform = `rotate(${leaf.angle}rad) scale(${leaf.size})`;
                    leaf.element.style.opacity = '1';
                    
                    // Rang o'zgarishi
                    const hue = (leaf.angle * 180 / Math.PI + 120) % 360;
                    const saturation = 70 + Math.sin(Date.now() * 0.001 + index) * 15;
                    leaf.element.style.background = `linear-gradient(to right, hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 70%))`;
                });
                
                requestAnimationFrame(animate);
            }
            
            animate();
            
            // Foydalanuvchi faolligi
            let inactiveTimer;
            document.addEventListener('mousemove', () => {
                // Barglarni kichraytirish
                leaves.forEach(leaf => {
                    leaf.element.style.transform += ' scale(0.7)';
                });
                
                // Agar oldingi timer bo'lsa, to'xtatish
                if (inactiveTimer) clearTimeout(inactiveTimer);
                
                // 1 soniyadan keyin asl holatiga qaytarish
                inactiveTimer = setTimeout(() => {
                    leaves.forEach(leaf => {
                        leaf.element.style.transform = leaf.element.style.transform.replace(' scale(0.7)', '');
                    });
                }, 800);
            });
            
            // Ekran o'lchamini o'zgartirganda
            window.addEventListener('resize', () => {
                leaves.forEach(leaf => {
                    leaf.x = Math.min(leaf.x, window.innerWidth);
                    leaf.y = Math.min(leaf.y, window.innerHeight);
                });
            });
        });